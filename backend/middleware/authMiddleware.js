const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests using a JWT token.
 * Extracts the token from the Authorization header.
 */
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
