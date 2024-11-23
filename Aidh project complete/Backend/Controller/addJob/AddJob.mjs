import { JobModel } from '../../Models/index.Models.mjs';
import { validationResult, body } from 'express-validator';

const AddJob = [
    // Validation rules
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('employmentType').notEmpty().withMessage('Employment type is required'),
    body('experience').isInt({ min: 0 }).withMessage('Experience must be a valid number'),
    body('role').notEmpty().withMessage('Role is required'),
    body('skills').notEmpty().withMessage('Skills are required'),
    body('requirements').notEmpty().withMessage('Requirements are required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('validTill').isISO8601().withMessage('Valid till date must be a valid ISO8601 date'),
    body('salary').isFloat({ min: 0 }).withMessage('Salary must be a valid number'),
    body('status').notEmpty().withMessage('Status is required'),

    // Controller function
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().reduce((acc, err) => {
                acc[err.param] = err.msg; // Use parameter name as key and message as value
                return acc;
            }, {});
        
            return res.status(400).json({ message: formattedErrors });
        }

        const {
            title, description, employmentType, experience, role, skills,
            requirements, location, validTill, salary, status
        } = req.body;

        try {
            // Create a new job object, including the organization ID from the JWT
            const newJob = new JobModel({
                title,
                description,
                employmentType,
                experience: parseInt(experience),  // Ensure experience is saved as a number
                role,
                skills,
                requirements,
                location,
                validTill: new Date(validTill),  // Convert to a Date object
                salary: parseFloat(salary),  // Ensure salary is saved as a float
                status,
                organizationId: req.user.userId, // Add organization ID from the decoded JWT
            });

            await newJob.save();
            res.status(201).json({ message: true });
        } catch (error) {
            console.error('Error adding job:', error.message); // Log full error
            res.status(500).json({ message: 'Error adding job', error: error.message });
        }
    }
];

export default AddJob;