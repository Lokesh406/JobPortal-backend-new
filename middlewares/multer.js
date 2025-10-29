import multer from "multer";

const storage = multer.memoryStorage();

// File filter for resume uploads (PDF and Word documents)
const resumeFileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and Word documents (.pdf, .doc, .docx) are allowed'), false);
    }
};

// File filter for images (profile photos)
const imageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
    }
};

// For registration - profile photo upload
export const registrationUpload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
}).single("file");

// For profile updates - handles both resume and profile photo
export const profileUpdateUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
}).fields([
    { name: 'file', maxCount: 1 },           // Resume
    { name: 'profilePhoto', maxCount: 1 }    // Profile photo
]);

// For application resume uploads (deprecated - now using links)
export const singleUpload = multer({
    storage,
    fileFilter: resumeFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
}).single("resume");

// For company logo uploads
export const companyUpload = multer({storage}).single("file");
