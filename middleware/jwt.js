const jwt = require('jsonwebtoken');

const secretKey = 'yourSecretKey'; // Use a secure secret key, stored in environment variables in production

// Generate a JWT token
const generateToken = (customerId) => {
  return jwt.sign({ customerId }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting a token in the "Bearer <token>" format

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Verify token with secret key
    req.userId = decoded.customerId; // Attach the customer ID to the request object
    next(); // Move to the next middleware/route handler
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token.' });
  }
};

// Export the functions
module.exports = {
  generateToken,
  verifyToken,
};
