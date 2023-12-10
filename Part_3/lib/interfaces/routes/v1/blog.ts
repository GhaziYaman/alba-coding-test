import { Router } from "express";
import BlogController from "../../controllers/BlogController";
import AuthenticationMiddleware from "../../middlewares/AuthenticationMiddleware";
import { getMulter } from "../../middlewares/MulterMiddleware";

const router = Router();

router.get("/", BlogController.findBlogs);
router.get("/:id", BlogController.getBlog);
router.post(
  "/",
  AuthenticationMiddleware(),
  getMulter().fields([
    { name: "main_image", maxCount: 1 },
    { name: "additional_images", maxCount: 5 },
  ]),
  BlogController.createBlog
);
router.patch(
  "/:id",
  getMulter().fields([
    { name: "main_image", maxCount: 1 },
    { name: "additional_images", maxCount: 5 },
  ]),
  BlogController.updateBlog
);
router.delete("/:id", BlogController.deleteBlog);

export default router;
