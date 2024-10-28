// index.js (or server.js)
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


import { connectDB } from "../Models/index.Models.mjs";
import { 
    Signup, 
    Login, 
    SendOtp, 
    VerifyOtp, 
    ResetPassword, 
    OrganizationSignup, 
    OrganizationLogin, 
    OrganizationResetPassword, 
    AddJob, 
    GetJobsByOrganizationId,
    DeleteJob,
    EditJob,
    FetchActiveJobs,
    uploadResumeAndApply,
    getApplicationsByJobId,
    deleteUserFromAppliedJob
} from './index.Controller.mjs';
import cors from 'cors';


import { AuthenticateUserJwt,AuthenticateOrganizationUserJwt,upload } from '../Middleware/index.MiddleWare.mjs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Example routes
app.post("/signup", Signup); // Generate token after successful signup in the Signup controller
app.post("/login", Login); // Make sure Login generates a token
app.post('/send-otp', SendOtp);
app.post('/verify-otp', VerifyOtp);
app.post('/reset-password', ResetPassword);

// Organization routes
app.post("/organization-signup", OrganizationSignup);
app.post("/organization-login", OrganizationLogin);
app.post("/organization-reset-password",OrganizationResetPassword);

app.post("/add-job",AuthenticateOrganizationUserJwt, AddJob); // Protect this route
app.get("/get-jobs-by-organizationId",AuthenticateOrganizationUserJwt,GetJobsByOrganizationId); // Protect this route
app.get("/get-active-jobs",AuthenticateUserJwt,FetchActiveJobs);

app.delete('/delete-job/:jobId',AuthenticateOrganizationUserJwt,DeleteJob);
app.put('/update-job/:jobId',AuthenticateOrganizationUserJwt,EditJob);


// Resume Upload Route
app.post("/upload-resume", AuthenticateUserJwt, upload.single('resume'), uploadResumeAndApply);

app.get("/get-applications-by-job-id/:jobId",AuthenticateOrganizationUserJwt,getApplicationsByJobId);

// In your Express server routes
app.delete('/delete-application/:applicationId', AuthenticateOrganizationUserJwt, deleteUserFromAppliedJob);



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
