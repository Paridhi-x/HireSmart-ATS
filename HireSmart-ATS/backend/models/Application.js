const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeText: {
    type: String,
    default: ''
  },
  resumeFileName: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview', 'Hired', 'Rejected'],
    default: 'Applied'
  },
  // AI ATS Score fields
  atsScore: {
    type: Number,
    default: 0
  },
  matchedSkills: {
    type: [String],
    default: []
  },
  missingSkills: {
    type: [String],
    default: []
  },
  aiSummary: {
    type: String,
    default: ''
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
