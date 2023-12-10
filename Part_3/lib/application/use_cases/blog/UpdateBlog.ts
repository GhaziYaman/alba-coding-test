import BlogValidator from "../../../domain/validators/BlogValidator";
import GetBlog from "./GetBlog";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (blogData: any, serviceLocator: ServiceLocator) => {
  const { blogRepository } = serviceLocator;
  let blog = await GetBlog(blogData.id, serviceLocator);
  if (blog == null) throw new Error("Unknown ID");
  blog = { ...blog, ...blogData };
  let copy = blog as any;
  if (blog.date_time instanceof Date) {
    copy.date_time = Math.floor(blog.date_time.getTime() / 1000);
  }
  await BlogValidator.tailor("update").validateAsync(copy);
  copy.date_time = new Date(copy.date_time * 1000);
  return blogRepository!.merge(copy);
};
