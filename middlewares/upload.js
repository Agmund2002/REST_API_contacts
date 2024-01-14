import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: path.resolve("temp"),
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniquePrefix}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
});

export default upload;
