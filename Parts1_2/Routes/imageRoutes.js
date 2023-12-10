const express = require("express");
const ImageRoutes = express.Router();
const { Validate } = require("../middlewares/ErrorHandlers");
const { ImageController } = require("../Controllers/ImageController");
const multer = require("multer");
const { ImageValidators } = require("../Validators/Image");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { VerifyJWT } = require("../middlewares/VerifyToken");

ImageRoutes.post(
  "/generateToken",
  upload.fields([]),
  ImageValidators.generatorToken,
  Validate,
  ImageController.GenerateImageToken
);

ImageRoutes.post(
  "/getImage",
  upload.fields([]),
  VerifyJWT,
  ImageValidators.getImage,
  Validate,
  ImageController.GetImageByToken
);

module.exports = ImageRoutes;
