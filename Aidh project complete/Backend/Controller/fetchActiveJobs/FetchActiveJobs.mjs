import JobModel from '../../Models/Job.Model.mjs'; // Adjust the path to your Job model

const FetchActiveJobs = async (req, res) => {
  try {
    // Find jobs with an active status
    const activeJobs = await JobModel.find({ status: 'Active' });
    
    // Respond with the active jobs
    res.status(200).json(activeJobs);
  } catch (error) {
    console.error("Error fetching active jobs:", error);
    res.status(500).json({ message: "Server error. Could not retrieve active jobs." });
  }
};

export default FetchActiveJobs;
