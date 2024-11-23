import express from 'express';
import bcrypt from 'bcryptjs'; // For hashing passwords
import { UserData } from '../../Models/index.Models.mjs'; // Import the User model
import { GenerateUserToken } from '../../Middleware/index.MiddleWare.mjs'; // Import your token generation function
import { body, validationResult } from 'express-validator'; // Import express-validator

// Define validation rules for signup
const signupValidationRules = [
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('country').notEmpty().withMessage('Country is required.'),
    body('mobile').notEmpty().withMessage('Mobile number is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];

// Define validation rules for login
const loginValidationRules = [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.')
];

// Define the signup function
const Signup = async (req, res) => {
    // Execute validation rules
    await Promise.all(signupValidationRules.map(rule => rule.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return errors if validation fails
    }

    const { firstName, lastName, email, country, mobile, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await UserData.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserData({
            firstName,
            lastName,
            email,
            country,
            mobile,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token upon registration
        const token = GenerateUserToken({ userId: newUser._id });

        res.status(201).json({ message: true, token });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Define the login function
const Login = async (req, res) => {
    // Execute validation rules
    await Promise.all(loginValidationRules.map(rule => rule.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return errors if validation fails
    }

    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await UserData.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token upon successful login
        const token = GenerateUserToken({ userId: user._id });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Export both signup and login functions
export { Signup, Login, signupValidationRules, loginValidationRules };
