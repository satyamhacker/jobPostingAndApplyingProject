// models/JobApplication.Model.mjs
import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  resumeFilename: {
    type: String, // Field to store the uploaded resume filename
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

export default JobApplication;
