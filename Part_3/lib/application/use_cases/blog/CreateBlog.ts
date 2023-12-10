import Blog from "../../../domain/entities/Blog";
import BlogValidator from "../../../domain/validators/BlogValidator";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (userData: any, { blogRepository }: ServiceLocator) => {
  await BlogValidator.tailor("create").validateAsync(userData);
  const blog = new Blog({
    title: userData.title,
    description: userData.description,
    main_image: userData.main_image,
    additional_images: userData.additional_images,
    date_time: new Date(userData.date_time * 1000),
    title_slug: userData.title.toLowerCase().replace(/ /g, "_"),
  });
  return blogRepository!.persist(blog);
};
