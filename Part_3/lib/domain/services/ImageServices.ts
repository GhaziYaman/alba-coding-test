import fs from "fs";

export default class ImageServices {
  static saveImage(file: Express.Multer.File) {
    let uniqueid = Math.random().toString(36).substring(2, 15);

    let filename = uniqueid + "-" + file.originalname;
    fs.writeFile(
      __dirname + "/../../../images/" + filename,
      file.buffer,
      (err) => {
        if (err) {
          console.log(err);
          return null;
        }
      }
    );
    return filename;
  }

  async getImage(filename: string) {
    let image = fs.readFileSync(__dirname + "/../../../images/" + filename);
    return image;
  }
}
