const multer = require("multer");

const getMulter = (sizeLimit = 1024 * 1024) => {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "image/jpeg") {
        cb(null, true);
      } else {
        cb(new Error("Only JPG images"));
      }
    },
    limits: {
      fileSize: sizeLimit,
    },
  });
  return upload;
};

module.exports = { getMulter };
