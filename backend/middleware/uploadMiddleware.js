/**
 * Middleware to handle multipart/form-data uploads using Multer.
 * Stores uploaded files in memory
 */
const multer = require('multer');
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage: storage });

module.exports = uploadMiddleware.any();
