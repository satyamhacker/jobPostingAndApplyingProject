// EditJob.js
import { JobModel } from '../../Models/index.Models.mjs';

const EditJob = async (req, res) => {
  try {
    const { jobId } = req.params; // Get the job ID from the request parameters
    const updatedData = req.body; // Get the updated job data from the request body

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required." });
    }
    

    // Validate required fields if necessary
    if (!updatedData.title || !updatedData.description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    // Update the job document in the database
    const updatedJob = await JobModel.findByIdAndUpdate(jobId, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updated data
    });

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.status(200).json({ message: true, job: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error.message);
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

export default EditJob;
