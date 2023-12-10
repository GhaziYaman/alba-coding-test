import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (
  userId: string,
  { userBlogRepository }: ServiceLocator
) => {
  const userBlog = await userBlogRepository!.getByUserId(userId);
  if (!userBlog) {
    return null;
  }
  return userBlog;
};
