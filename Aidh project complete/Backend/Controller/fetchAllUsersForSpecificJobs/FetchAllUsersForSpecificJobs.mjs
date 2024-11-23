import { JobApplication, UserData } from "../../Models/index.Models.mjs";
import mongoose from "mongoose";
const getApplicationsByJobId = async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) {
    return res.status(400).json({ message: "Job ID is required." });
  }
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit; // Calculate the number of items to skip

  try {
    const applicationsWithUsers = await JobApplication.aggregate([
      { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
      {
        $lookup: {
          from: "userdatas",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          jobId: 1,
          userId: 1,
          "userDetails._id": 1,
          "userDetails.firstName": 1,
          "userDetails.lastName": 1,
          "userDetails.email": 1,
          "userDetails.mobile": 1,
          resumeFilename: 1,
        },
      },
      { $skip: skip }, // Skip the first 'skip' items
      { $limit: limit }, // Limit to 'limit' items
    ]);

    const totalApplications = await JobApplication.countDocuments({ jobId: new mongoose.Types.ObjectId(jobId) });
    const totalPages = Math.ceil(totalApplications / limit);

    return res.status(200).json({
      applications: applicationsWithUsers,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({ message: "An error occurred while fetching applicants." });
  }
};


export default getApplicationsByJobId;
