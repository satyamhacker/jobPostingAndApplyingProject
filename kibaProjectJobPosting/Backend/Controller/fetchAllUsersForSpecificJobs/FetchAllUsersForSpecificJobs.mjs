// index.Controller.mjs
import {JobApplication, UserData}  from "../../Models/index.Models.mjs"

const getApplicationsByJobId = async (req, res) => {
  const { jobId } = req.params;

  try {
    // Find all applications for the specific job ID
    const applications = await JobApplication.find({ jobId });

    // Extract userIds from the applications
    const userIds = applications.map(app => app.userId); // Assuming userId is stored in the JobApplication model

    // Fetch user details based on userIds
    const users = await UserData.find({ _id: { $in: userIds } });

    // Send back the users' details
    return res.status(200).json({users,applications});
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({ message: "An error occurred while fetching applicants." });
  }
};

export default getApplicationsByJobId;
