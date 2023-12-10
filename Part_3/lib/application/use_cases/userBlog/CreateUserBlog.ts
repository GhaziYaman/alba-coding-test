import UserBlog from "../../../domain/entities/UserBlog";
import UserBlogValidator from "../../../domain/validators/UserBlogValidator";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (
  userBlogData: any,
  { userBlogRepository }: ServiceLocator
) => {
  // await UserBlogValidator.tailor("create").validateAsync(userBlogData);
  const userBlog = new UserBlog({
    userId: userBlogData.userId.id,
    blogId: userBlogData.blogId.id,
  });
  return userBlogRepository!.persist(userBlog);
};
