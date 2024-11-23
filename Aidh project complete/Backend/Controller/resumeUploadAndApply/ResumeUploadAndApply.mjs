// Controllers/ResumeUpload.mjs
import { JobApplication } from "../../Models/index.Models.mjs"

const uploadResumeAndApply = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required." });
    }

    const userId = req.user.userId; // Assuming user ID is available in req.user from token middleware

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

     // Check if the user has already applied for this job
     const existingApplication = await JobApplication.findOne({ jobId, userId });

     if (existingApplication) {
       return res.status(400).json({ message: 'You have already applied for this job.' });
     }

    const resumeFilename = req.file.filename; // Get the filename

    // Save the job application in the database
    const newApplication = new JobApplication({
      jobId,
      userId,
      resumeFilename,
    });

    await newApplication.save();

    console.log(`Resume uploaded for job: ${jobId}, filename: ${resumeFilename}`);

    res.status(200).json({ message: true });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default uploadResumeAndApply;
