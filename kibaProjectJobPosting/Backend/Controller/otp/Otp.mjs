import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

import {OtpModels,UserData,OrganizationUserData} from "../../Models/index.Models.mjs"

// Function to send OTP
// Function to send OTP
export const SendOtp = async (req, res) => {
    const { email } = req.body;
   
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    // Save OTP to the database with an expiration time
    await OtpModels.create({ email, otp, createdAt: Date.now() });

    // Set up Nodemailer transporter using your Gmail account
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bugtestingemaillogin@gmail.com', // Replace with your Gmail email
            pass: 'epjd tehf fuif yfkd',    // Replace with your Gmail app password
        },
    });

    // Define the email options
    const mailOptions = {
        from: 'your_email@gmail.com', // Sender address
        to: email,                    // Recipient address
        subject: 'Your OTP Code',     // Subject line
        text: `Your OTP code is: ${otp}. It is valid for 2 minutes.`, // Plain text body
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}: ${otp}`); // For testing purposes
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};
// Function to verify OTP
export const VerifyOtp = async (req, res) => {
    const { email, otp } = req.body;

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
};

// Function to reset password
export const ResetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

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

    res.status(200).json({ message: 'Password reset successfully' });
};



// Function to reset password
export const OrganizationResetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    // Find user by email
    const user = await OrganizationUserData.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Optionally, remove the OTP from the database if you want
    await OtpModels.deleteMany({ email });

    res.status(200).json({ message: 'Password reset successfully' });
};



// Delete expired OTPs every minute (optional)
setInterval(async () => {
    await OtpModels.deleteMany({ createdAt: { $lt: Date.now() - 120 * 1000 } }); // Clean up expired OTPs
}, 60 * 1000);
