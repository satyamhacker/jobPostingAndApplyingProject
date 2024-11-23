import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'SatyamLegend';
const OrganizationUserJwtSecret = process.env.OrganizationUserJwtSecret || 'SatyamBoss';

// Function to generate a JWT token
const GenerateUserToken = (user) => {
    return jwt.sign(user, jwtSecret, { expiresIn: '6h' });
};
const GenerateOrganizationUserToken = (user) => {
    return jwt.sign(user, OrganizationUserJwtSecret, { expiresIn: '6h' });
};

// Middleware to authenticate JWT for general users
const AuthenticateUserJwt = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401); // Unauthorized if no token
    }

    try {
        const user = jwt.verify(token, jwtSecret);
        req.user = { ...user, role: user.role }; // Attach user info, including role, to request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};

// Middleware to authenticate JWT for organization users
const AuthenticateOrganizationUserJwt = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401); // Unauthorized if no token
    }

    try {
        const user = jwt.verify(token, OrganizationUserJwtSecret);
        req.user = { ...user, role: user.role }; // Attach user info, including role, to request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};

export { AuthenticateUserJwt, GenerateUserToken, GenerateOrganizationUserToken, AuthenticateOrganizationUserJwt };
