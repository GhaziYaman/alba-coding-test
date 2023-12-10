const { body } = require("express-validator");

exports.ImageValidators = {
  generatorToken: [body("image_path").notEmpty()],
  getImage: [body("image_path").notEmpty(), body("token").notEmpty()],
};
