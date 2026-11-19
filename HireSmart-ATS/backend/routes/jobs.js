const express = require('express');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all active jobs (public + candidates)
router.get('/', async (req, res) => {
  try {
    const { search, location, type } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name company')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// IMPORTANT: specific routes before :id
// @route   GET /api/jobs/recruiter/my-jobs
router.get('/recruiter/my-jobs', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicationCount: count };
      })
    );

    res.json(jobsWithCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs
router.post('/', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const { title, company, location, type, description, requirements, salary, skills } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: 'Please provide title, company, location and description' });
    }

    const job = await Job.create({
      title,
      company,
      location,
      type: type || 'Full-time',
      description,
      requirements: requirements || '',
      salary: salary || 'Not disclosed',
      skills: skills || [],
      recruiter: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating job' });
  }
});

// @route   PUT /api/jobs/:id
router.put('/:id', auth, requireRole('recruiter'), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const fields = ['title', 'company', 'location', 'type', 'description', 'requirements', 'salary', 'skills', 'isActive'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating job' });
  }
});

// @route   DELETE /api/jobs/:id
router.delete('/:id', auth, requireRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    job.isActive = false;
    await job.save();

    res.json({ message: 'Job deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
