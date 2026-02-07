import multer from "multer";

// Use memory storage so uploads work on Render (ephemeral filesystem).
// File is available as req.file.buffer for Cloudinary.
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
