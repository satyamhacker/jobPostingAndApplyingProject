import JobApplication from '../models/JobApplication.Model.mjs';
import User from '../models/User.Model.mjs'; // Adjust import based on your User model path

// Function to get all userIds for a specific jobId
export const getApplicationsByJobId = async (req, res) => {
  const { jobId } = req.params; // Assuming you're passing jobId as a route parameter

  try {
    // Fetch applications for the specific jobId
    const applications = await JobApplication.find({ jobId }).populate('userId'); // Populate userId to get user details

    // Extract userIds and user details
    const userDetails = applications.map(application => ({
      userId: application.userId._id,
      userName: application.userId.name, // Assuming the user model has a 'name' field
      userEmail: application.userId.email, // Assuming the user model has an 'email' field
      // Include any other fields you need
    }));

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
