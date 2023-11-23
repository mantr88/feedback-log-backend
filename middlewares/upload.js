import multer from 'multer';
import path from 'node:path';

const tempDir = path.join(process.cwd(), '..', 'temp');
const avatarSize = 1048576;

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: { fileSize: avatarSize },
});

const upload = multer({ storage: multerConfig });

export default upload;
