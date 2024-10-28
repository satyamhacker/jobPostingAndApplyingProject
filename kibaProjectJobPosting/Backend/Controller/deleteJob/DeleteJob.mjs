import { JobModel } from '../../Models/index.Models.mjs';

const DeleteJobData = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate the job ID
    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required.' });
    }

    // Find and delete the job by ID
    const deletedJob = await JobModel.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.status(200).json({ message: 'Job deleted successfully.' });
  } catch (error) {
    console.error('Error deleting job:', error.message);
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};

export default DeleteJobData;
