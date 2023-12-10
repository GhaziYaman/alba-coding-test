import multer from "multer";
import { RequestHandler } from "express";
import { emitKeypressEvents } from "readline";

const storage = multer.diskStorage({
  destination: "images",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb("Only images are allowed!", false);
  }
};

const getMulter = (
  sizeLimit: number = 1024 * 1024 // 1MB
) => {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "image/jpeg") {
        cb(null, true);
      } else {
        // Return error with "message" property "Only JPG images"
        cb(new Error("Only JPG images"));
      }
    },
    limits: {
      fileSize: sizeLimit,
    },
  });
  return upload;
};

export { getMulter };
