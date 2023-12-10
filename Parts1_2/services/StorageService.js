const fs = require("fs");

exports.STORAGE_SERVICE = {
  saveImage: (image, filename) => {
    if (!fs.existsSync("images")) {
      fs.mkdirSync("images");
    }
    fs.writeFileSync(`images/${filename}`, image.buffer);
  },
  getImage: (filename) => {
    try {
      const image = fs.readFileSync(`images/${filename}`);
      return image;
    } catch (e) {
      return null;
    }
  },
};
