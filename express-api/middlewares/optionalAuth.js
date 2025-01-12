const jwt = require('jsonwebtoken');

// Optional authentication middleware
// If token is present and valid, attaches user to request
// If no token or invalid token, continues without error
const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Invalid token, but we'll continue without it
            console.error('Invalid token in optional auth:', error);
        }
    }
    
    next();
};

module.exports = { optionalAuth };