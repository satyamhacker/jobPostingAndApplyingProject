// Middleware/MulterConfig.mjs
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the upload path
const UPLOAD_PATH = 'uploads/resumes';

// Ensure the directory exists
if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true }); // Create directories if they don't exist
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_PATH); // Store resumes in 'uploads/resumes/'
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Save with unique timestamp-based name
    },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = /pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.test(ext)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false); // Reject invalid files
    }
};

export const upload = multer({ storage, fileFilter });
