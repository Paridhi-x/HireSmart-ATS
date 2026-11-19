const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, requireRole } = require('../middleware/auth');
const { analyzeResume } = require('../utils/gemini');

const router = express.Router();

// Memory storage for PDF (no disk write needed)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// @route   POST /api/applications
// @desc    Apply to a job (candidate) with resume PDF
router.post('/', auth, requireRole('candidate'), upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume PDF is required' });
    }

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Extract text from PDF
    let resumeText = '';
    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text || '';
    } catch (pdfErr) {
      console.error('PDF parse error:', pdfErr.message);
      resumeText = 'Could not extract text from PDF';
    }

    // Run Gemini ATS analysis
    const analysis = await analyzeResume(resumeText, job.description + '\n' + (job.requirements || ''), job.skills);

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeText: resumeText.substring(0, 15000),
      resumeFileName: req.file.originalname,
      atsScore: analysis.score,
      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,
      aiSummary: analysis.summary,
      status: 'Applied'
    });

    const populated = await Application.findById(application._id)
      .populate('job', 'title company location')
      .populate('candidate', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Apply error:', error);
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while applying' });
  }
});

// @route   GET /api/applications/my
// @desc    Get current candidate's applications
router.get('/my', auth, requireRole('candidate'), async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location type salary')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a job (recruiter who owns the job)
router.get('/job/:jobId', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email')
      .sort({ atsScore: -1 }); // Highest score first

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (recruiter)
router.put('/:id/status', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Applied', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    application.updatedAt = Date.now();
    await application.save();

    const populated = await Application.findById(application._id)
      .populate('candidate', 'name email')
      .populate('job', 'title company');

    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

// @route   GET /api/applications/dashboard
// @desc    Recruiter dashboard stats
router.get('/dashboard', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const myJobs = await Job.find({ recruiter: req.user._id });
    const jobIds = myJobs.map(j => j._id);

    const totalJobs = myJobs.length;
    const activeJobs = myJobs.filter(j => j.isActive).length;

    const applications = await Application.find({ job: { $in: jobIds } });
    const totalApplicants = applications.length;
    const shortlisted = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Hired').length;
    const hired = applications.filter(a => a.status === 'Hired').length;

    res.json({
      totalJobs,
      activeJobs,
      totalApplicants,
      shortlisted,
      hired
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
