// index.js (or server.js)
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { connectDB } from '../Models/index.Models.mjs';
import { 
    Signup, Login, SendOtp, VerifyOtp, ResetPassword, 
    OrganizationSignup, OrganizationLogin, OrganizationResetPassword, 
    AddJob, GetJobsByOrganizationId, DeleteJob, EditJob, 
    FetchActiveJobs, uploadResumeAndApply, getApplicationsByJobId, 
    deleteUserFromAppliedJob 
} from './index.Controller.mjs';
import { AuthenticateUserJwt, AuthenticateOrganizationUserJwt, upload, AuthorizeRoles } from '../Middleware/index.MiddleWare.mjs';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security Middlewares
app.use(helmet()); // Set security headers

// Configure CORS to allow frontend access
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow cookies or authorization headers
}));

// Set up a rate limiter for all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Max 100 requests per IP in the window
  message: 'Too many requests, please try again later.',
});
app.use(limiter); // Apply the rate limiter globally

app.use(express.json()); // Parse incoming JSON requests

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Routes for User Management
app.post("/signup", Signup); // Generate token after signup
app.post("/login", Login); // Ensure login generates a token
app.post('/send-otp', SendOtp);
app.post('/verify-otp', VerifyOtp);
app.post('/reset-password', ResetPassword);

// Organization Routes
app.post("/organization-signup", OrganizationSignup);
app.post("/organization-login", OrganizationLogin);
app.post("/organization-reset-password", OrganizationResetPassword);

// Job Management Routes (Protected)
app.post("/add-job", AuthenticateOrganizationUserJwt, AuthorizeRoles('HR', 'Admin'), AddJob);

app.get("/get-jobs-by-organizationId", AuthenticateOrganizationUserJwt, AuthorizeRoles('Manager', 'HR', 'Admin'),GetJobsByOrganizationId);
app.get("/get-active-jobs", AuthenticateUserJwt, FetchActiveJobs);
app.delete('/delete-job/:jobId', AuthenticateOrganizationUserJwt, AuthorizeRoles('Admin'), DeleteJob);
app.put('/update-job/:jobId', AuthenticateOrganizationUserJwt, AuthorizeRoles('Admin'), EditJob);

// Resume Upload Route (Protected)
app.post("/upload-resume", AuthenticateUserJwt, upload.single('resume'), uploadResumeAndApply);

// Application Routes (Protected)
app.get("/get-applications-by-job-id/:jobId", AuthenticateOrganizationUserJwt, AuthorizeRoles('Manager', 'HR', 'Admin'), getApplicationsByJobId);
app.delete("/delete-application/:applicationId", AuthenticateOrganizationUserJwt, AuthorizeRoles('Manager', 'HR', 'Admin'),deleteUserFromAppliedJob);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
