const jwt = require('jsonwebtoken');
const { JWT_TOKEN } = require('../routes/config');

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({ error: "Access denied! No token provided." });
    }

    try {
        const data = jwt.verify(token, JWT_TOKEN);
        req.user = data.user; // Attach user data to request object
        next(); // Pass control to next middleware/route
    } catch (error) {
        res.status(401).json({ error: "Invalid token!" });
    }
};

module.exports = fetchuser;
