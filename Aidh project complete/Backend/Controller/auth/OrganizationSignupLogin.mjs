import bcrypt from 'bcryptjs'; // For hashing passwords
import jwt from 'jsonwebtoken'; // For creating tokens
import { validationResult, body } from 'express-validator';
import { OrganizationUserData } from '../../Models/index.Models.mjs'; // Import the User model
import { GenerateOrganizationUserToken } from '../../Middleware/jwt.Middleware.mjs';

// Define the signup function
export const OrganizationSignup = [
    // Validation rules for signup
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('country').notEmpty().withMessage('Country is required'),
    body('mobile').isMobilePhone().withMessage('Mobile number is invalid'),
    body('role').isIn(['HR', 'Admin', 'Manager']).withMessage('Role must be either HR, Admin, or Manager'), // Added role validation
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().reduce((acc, err) => {
                acc[err.param] = err.msg; // Use parameter name as key and message as value
                return acc;
            }, {});
        
            return res.status(400).json({ message: formattedErrors });
        }
       

        const { firstName, lastName, email, country, mobile, role, password } = req.body;

        try {
            // Check if user already exists
            const existingUser = await OrganizationUserData.findOne({ email, role });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email and role already exists' });

            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new OrganizationUserData({
                firstName,
                lastName,
                email,
                country,
                mobile,
                role, // Set role
                // Passwords will be conditionally included based on the role
                ...(role === 'HR' && { hrPassword: hashedPassword }),
                ...(role === 'Manager' && { managerPassword: hashedPassword }),
                ...(role === 'Admin' && { adminPassword: hashedPassword }),
            });

            await newUser.save();

            // Generate JWT token upon registration
            const token = GenerateOrganizationUserToken({ userId: newUser._id, role: newUser.role });

            res.status(201).json({ message: "Signup successful", token }); // Return the token in response
        } catch (error) {
            console.error('Error during signup:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
];



// Define the login function
export const OrganizationLogin = [
    // Validation rules for login
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').isIn(['HR', 'Admin', 'Manager']).withMessage('Role must be either HR, Admin, or Manager'), // Role validation

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().reduce((acc, err) => {
                acc[err.param] = err.msg; // Use parameter name as key and message as value
                return acc;
            }, {});
        
            return res.status(400).json({ message: formattedErrors });
        }

        const { email, password, role } = req.body;

        try {
            // Find the user by email
            const user = await OrganizationUserData.findOne({ email, role });
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Check if the user's role matches the role provided in the request
            if (user.role !== role) {
                return res.status(400).json({ message: 'Invalid role' });
            }

            // Compare the provided password with the stored hashed password based on the role
            let isPasswordValid = false;

            if (role === 'HR') {
                isPasswordValid = await bcrypt.compare(password, user.hrPassword);
            } else if (role === 'Manager') {
                isPasswordValid = await bcrypt.compare(password, user.managerPassword);
            } else if (role === 'Admin') {
                isPasswordValid = await bcrypt.compare(password, user.adminPassword);
            }

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token upon successful login
            const token = GenerateOrganizationUserToken({ userId: user._id, role: user.role });

            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
];
