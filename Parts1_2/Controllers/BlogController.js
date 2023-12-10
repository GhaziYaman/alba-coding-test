const { IMAGE_COMPRESSION_SERVICE } = require("../services/ImageService");
const { STORAGE_SERVICE } = require("../services/StorageService");
const { DATABASE_SERVICE } = require("../services/DatabaseService");
const fs = require("fs");
const moment = require("moment");

exports.BlogController = {
  async CreateBlog(req, res) {
    const { title, description, date_time } = req.body;
    const mainImage = req.files["main_image"][0];
    const additionalImages = req.files["additional_images"] || [];

    const compressedMainImage = await IMAGE_COMPRESSION_SERVICE.CompressImage(
      mainImage,
      25
    );
    const compressedAdditionalImages =
      await IMAGE_COMPRESSION_SERVICE.bulkCompressImages(additionalImages, 25);

    const mainImageFilename = `main_${Date.now()}_${mainImage.originalname}`;
    STORAGE_SERVICE.saveImage(compressedMainImage, mainImageFilename);

    const additionalImageFilenames = compressedAdditionalImages.map(
      (image, index) => {
        const filename = `additional_${index + 1}_${Date.now()}_${
          image.originalname
        }`;
        STORAGE_SERVICE.saveImage(image, filename);
        return filename;
      }
    );

    let blogsData = [];
    try {
      const existingData = fs.readFileSync("blogs.json", "utf8");
      blogsData = JSON.parse(existingData);
    } catch (error) {}

    const blogPost = {
      title,
      description,
      main_image: mainImageFilename,
      additional_images: additionalImageFilenames,
      date_time: parseInt(date_time),
    };
    DATABASE_SERVICE.pushBlog(blogPost);
    res.status(201).json({
      message: "Blog post created successfully",
      data: blogPost,
    });
  },
  async GetAllBlogs(req, res) {
    let blogsData = [];
    try {
      const existingData = fs.readFileSync("blogs.json", "utf8");
      blogsData = JSON.parse(existingData);
    } catch (error) {}

    if (Array.isArray(blogsData)) {
      if (blogsData.length === 0) {
        return res.status(404).json({
          message: "No blogs found",
          data: [],
        });
      }
    } else {
      return res.status(404).json({
        message: "Something Went Wrong!",
      });
    }

    blogsData = blogsData.map((blog) => {
      blog.date_time = moment
        .unix(blog.date_time)
        .format("YYYY-MM-DDTHH:mm:ss");

      blog.title_slug = blog.title.toLowerCase().replace(/\s/g, "_");
      return blog;
    });

    res.send(blogsData);
  },
};
