import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';

import { OtpModels, UserData, OrganizationUserData } from "../../Models/index.Models.mjs"

// Function to send OTP
export const SendOtp = [
    // Validation rules
    body('email').isEmail().withMessage('Valid email is required'),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

        try {
            // Save OTP to the database with an expiration time
            await OtpModels.create({ email, otp, createdAt: Date.now() });

            // Set up Nodemailer transporter using your Gmail account
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'bugtestingemaillogin@gmail.com', // Replace with your Gmail email
                    pass: 'epjd tehf fuif yfkd', // Replace with your Gmail app password
                },
            });

            // Define the email options
            const mailOptions = {
                from: 'your_email@gmail.com', // Sender address
                to: email,                    // Recipient address
                subject: 'Your OTP Code',     // Subject line
                text: `Your OTP code is: ${otp}. It is valid for 2 minutes.`, // Plain text body
            };

            // Send the email
            await transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}: ${otp}`); // For testing purposes
            res.status(200).json({ message: true });
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ message: 'Failed to send OTP', error: error.message });
        }
    }
];

// Function to verify OTP
export const VerifyOtp = [
    // Validation rules
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be a 6-digit number'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;

        try {
            // Find OTP in the database
            const otpEntry = await OtpModels.findOne({ email, otp });
            if (!otpEntry) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }

            // Check if the OTP is still valid (2 minutes)
            const isExpired = (Date.now() - otpEntry.createdAt) > 120 * 1000; // 120 seconds

            if (isExpired) {
                await OtpModels.deleteOne({ _id: otpEntry._id }); // Remove expired OTP
                return res.status(400).json({ message: 'OTP has expired' });
            }

            // OTP is valid
            res.status(200).json({ message: 'OTP verified successfully' });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
        }
    }
];

// Function to reset password
export const ResetPassword = [
    // Validation rules
    body('email').isEmail().withMessage('Valid email is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, newPassword } = req.body;

        try {
            // Find user by email
            const user = await UserData.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            // Optionally, remove the OTP from the database if you want
            await OtpModels.deleteMany({ email });

            res.status(200).json({ message: true });
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ message: 'Failed to reset password', error: error.message });
        }
    }
];

// Function to reset password for organization users
export const OrganizationResetPassword = [
    // Validation rules
    body('email').isEmail().withMessage('Valid email is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['HR', 'Admin', 'Manager']).withMessage('Role must be either HR, Admin, or Manager'), // Validate role


    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().reduce((acc, err) => {
                acc[err.param] = err.msg; // Use parameter name as key and message as value
                return acc;
            }, {});
        
            return res.status(400).json({ message: formattedErrors });
        }
        

        const { email, newPassword, role } = req.body;

        try {
            // Find user by email and role
            const user = await OrganizationUserData.findOne({ email, role });
            if (!user) {
                return res.status(404).json({ message: 'Organization  not found or Invalid Role Selected' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the password field based on the role
            if (role === 'HR') {
                user.hrPassword = hashedPassword;
            } else if (role === 'Admin') {
                user.adminPassword = hashedPassword;
            } else if (role === 'Manager') {
                user.managerPassword = hashedPassword;
            }

            await user.save();

            // Optionally, remove the OTP from the database if you want
            await OtpModels.deleteMany({ email });

            res.status(200).json({ message: "Organization  Password Reset Successfully" });
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ message: 'Failed to reset password', error: error.message });
        }
    }
];

// Delete expired OTPs every minute (optional)
setInterval(async () => {
    try {
        await OtpModels.deleteMany({ createdAt: { $lt: Date.now() - 120 * 1000 } }); // Clean up expired OTPs
    } catch (error) {
        console.error('Error deleting expired OTPs:', error);
    }
}, 60 * 1000);
