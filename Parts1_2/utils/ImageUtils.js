const sharp = require("sharp");
const fs = require("fs");

exports.CompressImage = async (image, percentage) => {
  const uuid = Math.random().toString(36).substring(2, 15);

  if (!fs.existsSync("temp")) {
    fs.mkdirSync("temp");
  }

  fs.writeFileSync(`temp/${uuid}.jpg`, image.Buffer);

  const savedimage = sharp(`temp/${uuid}.jpg`);
  let metadata = await savedimage.metadata();

  let imageBuffer = await savedimage
    .resize(
      Math.round((metadata.width * (100 - percentage)) / 100),
      Math.round((metadata.height * (100 - percentage)) / 100)
    )
    .toBuffer();
  imageBuffer = Buffer.from(imageBuffer);
  return {
    buffer: imageBuffer,
    originalname: image.originalname,
    mimetype: image.mimetype,
  };
};
