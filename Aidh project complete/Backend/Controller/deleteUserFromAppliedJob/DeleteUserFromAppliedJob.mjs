import { JobApplication } from "../../Models/index.Models.mjs"; // Import JobApplication model
import fs from 'fs'; // Import File System module
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import helper for __dirname equivalent

// Get the current directory of the backend root (not the current module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), '..', '..'); // Navigate to the backend root

// Function to delete an application by ID
const deleteUserFromAppliedJob = async (req, res) => {
    const { applicationId } = req.params;
    if (!applicationId) {
        return res.status(400).json({ message: "Application ID is required." });
    }

    try {
        // Find the application to get the filename
        const application = await JobApplication.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: "Application not found." });
        }

        // Construct the correct path to the resume
        const resumePath = path.join(__dirname, 'Controller', 'uploads', 'resumes', application.resumeFilename);

        // Delete the resume file
        fs.unlink(resumePath, (err) => {
            if (err) {
                console.error("Error deleting resume file:", err);
                return res.status(500).json({ message: "Error deleting the resume file." });
            }
            console.log("Resume file deleted successfully");
        });

        // Delete the application from the database
        await JobApplication.findByIdAndDelete(applicationId);

        return res.status(200).json({ message: true });
    } catch (error) {
        console.error("Error deleting application:", error);
        return res.status(500).json({ message: "An error occurred while deleting the application." });
    }
};

// Export the function
export default deleteUserFromAppliedJob;
