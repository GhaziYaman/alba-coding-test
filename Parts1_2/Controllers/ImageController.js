const jwt = require("jsonwebtoken");
const { STORAGE_SERVICE } = require("../services/StorageService");
dotenv = require("dotenv");
dotenv.config();

exports.ImageController = {
  async GenerateImageToken(req, res) {
    const { image_path } = req.body;
    const token = jwt.sign({ image_path }, process.env.JWT_SECRET, {
      expiresIn: 300,
    });

    res.status(200).json({
      token,
    });
  },
  async GetImageByToken(req, res) {
    const { image_path } = req.body;
    const tokenImagePath = req.image_path;

    if (tokenImagePath !== image_path) {
      return res.status(400).json({
        error: "Invalid token",
      });
    }

    const image = STORAGE_SERVICE.getImage(image_path);
    if (!image) {
      return res.status(400).json({
        error: "Image not found",
      });
    }
    res.send({
      image: image.toString("base64"),
    });
    // image can be displayed using the following format
    // <img src={`data:image/jpeg;base64,${image}`} />
  },
};
