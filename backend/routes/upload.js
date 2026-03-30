import express from 'express';
const router = express.Router();
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    console.log(`Uploading to: ${uploadPath}`);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log(`Uploading file: ${file.originalname}`);
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File Filtering (allow common images)
const checkFileTypes = (file, cb) => {
  const filetypes = /jpeg|avif|jpg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, AVIF, JPG, PNG, WEBP, GIF) are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileTypes(file, cb);
  },
});

// @desc    Upload images
// @route   POST /api/upload
router.post('/', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: 'Please upload at least one image' });
  }

  const fileUrls = req.files.map(file => 
    `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
  );

  res.send({
    message: 'Images Uploaded',
    images: fileUrls,
    files: req.files.map(f => f.filename)
  });
});

export default router;
