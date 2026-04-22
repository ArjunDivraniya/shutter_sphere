const multer = require("multer");
const path = require("path");

// Memory storage for Cloudinary uploads
const memoryStorage = multer.memoryStorage();

// Disk storage for local file uploads
const diskStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: memoryStorage });
const uploadDisk = multer({ storage: diskStorage });

module.exports = upload;
module.exports.uploadDisk = uploadDisk;
