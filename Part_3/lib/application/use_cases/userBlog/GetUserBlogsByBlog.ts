import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (
  blodId: string,
  { userBlogRepository }: ServiceLocator
) => {
  const userBlogs = await userBlogRepository!.getByBlogId(blodId);
  if (!userBlogs) {
    return null;
  }
  return userBlogs;
};
