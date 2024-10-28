import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'SatyamLegend'; // Replace with your secret key
const OrganizationUserJwtSecret = process.env.OrganizationUserJwtSecret || 'SatyamBoss'; // Replace with your secret key;

// Function to generate a JWT token
const GenerateUserToken = (user) => {
    return jwt.sign(user, jwtSecret, { expiresIn: '6h' }); // Customize the expiration time as needed
};
const GenerateOrganizationUserToken = (user) => {
    return jwt.sign(user, OrganizationUserJwtSecret, { expiresIn: '6h' }); // Customize the expiration time as needed
};

// Middleware to authenticate JWT
const AuthenticateUserJwt = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer scheme

    if (!token) {
        return res.sendStatus(403); // Forbidden if no token
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    });
};
// Middleware to authenticate JWT
const AuthenticateOrganizationUserJwt = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer scheme

    if (!token) {
        return res.sendStatus(403); // Forbidden if no token
    }

    jwt.verify(token, OrganizationUserJwtSecret, (err, user) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    });
};

// Example usage: exporting the middleware and token generation function
export { AuthenticateUserJwt, GenerateUserToken,GenerateOrganizationUserToken,AuthenticateOrganizationUserJwt };
