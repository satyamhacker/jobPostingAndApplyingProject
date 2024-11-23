// Middleware to check role-based access
const AuthorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user;

        // Check if user's role is in the allowed roles for this route
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: 'Insufficient privileges' });
        }
        
        next(); // Role is authorized, proceed to the route
    };
};

export default AuthorizeRoles;