const express = require("express");
const BlogRoutes = express.Router();
const {
  Validate,
  MulterFileSizeExceed,
} = require("../middlewares/ErrorHandlers");
const { BlogController } = require("../controllers/BlogController");
const { BlogValidator } = require("../Validators/Blog");
const { getMulter } = require("../middlewares/MulterMiddleware");

BlogRoutes.post(
  "/create",
  getMulter().fields([
    { name: "main_image", maxCount: 1 },
    { name: "additional_images", maxCount: 5 },
  ]),
  MulterFileSizeExceed("1MB"),
  BlogValidator.createBlog,
  Validate,
  BlogController.CreateBlog
);

BlogRoutes.get("/all", BlogController.GetAllBlogs);

module.exports = BlogRoutes;
