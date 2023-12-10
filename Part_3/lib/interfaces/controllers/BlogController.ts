import { Request, Response } from "express";
import { ValidationError } from "joi";
import ListBlogs from "../../application/use_cases/blog/ListBlogs";
import GetBlog from "../../application/use_cases/blog/GetBlog";
import CreateBlog from "../../application/use_cases/blog/CreateBlog";
import UpdateBlog from "../../application/use_cases/blog/UpdateBlog";
import DeleteBlog from "../../application/use_cases/blog/DeleteBlog";
import GetUser from "../../application/use_cases/user/GetUser";
import { ServiceLocator } from "../../infrastructure/config/service-locator";
import Blog from "../../domain/entities/Blog";
import ImageServices from "../../domain/services/ImageServices";
import CreateUserBlog from "../../application/use_cases/userBlog/CreateUserBlog";
import { ID } from "../../domain/entities/Entity";

export default {
  async findBlogs(request: Request, response: Response) {
    const serviceLocator: ServiceLocator = request.serviceLocator!;
    const blogs = await ListBlogs(serviceLocator);
    const output = blogs.map((blog: Blog) =>
      serviceLocator.blogSerializer.serialize(blog, serviceLocator)
    );
    return response.json(output);
  },

  async getBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const blogId = request.params.id;

    // Treatment
    let blog = null;
    try {
      blog = await GetBlog(blogId, serviceLocator);
    } catch (err) {
      console.log(err);
    }

    // Output
    if (!blog) {
      return response.status(404).json({ message: "Not Found" });
    }
    const output = serviceLocator.blogSerializer.serialize(
      blog,
      serviceLocator
    );
    return response.json(output);
  },

  async createBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;
    let userId = request.userId as ID;

    // Input
    let files = request.files as unknown as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files["main_image"]) {
      return response.status(400).json({ message: "Main image is required" });
    }

    let mainImage = ImageServices.saveImage(files["main_image"][0]);
    let additionalImages = files["additional_images"]
      ? files["additional_images"].map((file) => ImageServices.saveImage(file))
      : [];

    let data = { ...request.body };
    data.main_image = mainImage;
    data.additional_images = additionalImages;

    let blog = null;
    let error = null;
    try {
      blog = await CreateBlog(data, serviceLocator);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        error = err.message;
      }
    }

    // Output
    if (!blog) {
      return response.status(400).json({ message: error });
    }

    let user = await GetUser(userId, serviceLocator);

    let userBlog = null;
    try {
      userBlog = await CreateUserBlog(
        {
          blogId: blog,
          userId: user,
        },
        serviceLocator
      );
    } catch (err: unknown) {
      console.log(err);
    }

    const output = serviceLocator.blogSerializer.serialize(
      blog,
      serviceLocator
    );
    return response.status(201).json(output);
  },

  async updateBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    let blogId = request.params.id;
    let inputData = request.body || {};
    let data: any = {
      id: blogId,
    };
    const acceptedFields: string[][] = [
      ["title"],
      ["description"],
      ["main_image"],
      ["additional_images"],
      ["date_time"],
    ];

    acceptedFields.forEach((acceptedField) => {
      if (inputData[acceptedField[0]] === undefined) return;
      data[acceptedField.length > 1 ? acceptedField[1] : acceptedField[0]] =
        inputData[acceptedField[0]];
    });

    let files = request.files as unknown as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (files["main_image"]) {
      let mainImage = ImageServices.saveImage(files["main_image"][0]);
      data.main_image = mainImage;
    }
    if (files["additional_images"]) {
      let additionalImages = files["additional_images"].map((file) =>
        ImageServices.saveImage(file)
      );
      data.additional_images = additionalImages;
    }

    // Treatment
    let blog = null;
    let error = null;
    try {
      blog = await UpdateBlog(data, serviceLocator);
    } catch (err) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        // 'Error occurred while creating user'
        error = err.message;
      }
    }

    // Output
    if (!blog) {
      return response.status(400).json({ message: error });
    }
    const output = serviceLocator.blogSerializer.serialize(
      blog,
      serviceLocator
    );
    return response.json(output);
  },

  async deleteBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const blogId = request.params.id;

    // Treatment
    let blog = null;

    try {
      blog = await DeleteBlog(blogId, serviceLocator);
    } catch (err) {
      console.log(err);
    }

    // Output
    if (!blog) {
      return response.status(404).json({ message: "Not Found" });
    }

    return response.status(204).json();
  },
};
