// GetJobsBy.js
import { JobModel } from '../../Models/index.Models.mjs'; // Adjust the import path if needed
import { AuthenticateOrganizationUserJwt } from '../../Middleware/index.MiddleWare.mjs'; // Import the middleware

const GetJobsByOrganizationId = async (req, res) => {
  try {
    const organizationId = req.user.userId; // Extracting organizationId from JWT

    const jobs = await JobModel.find({ organizationId }); // Querying by organizationId
    
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

export default GetJobsByOrganizationId;
