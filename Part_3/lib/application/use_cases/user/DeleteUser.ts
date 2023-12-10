import { ID } from "../../../domain/entities/Entity";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (
  userId: ID,
  { userRepository, userBlogRepository, blogRepository }: ServiceLocator
) => {
  //remove relations
  let blogsToRemove = await userBlogRepository!.removeAllUserBlogsByUserId(
    userId
  );

  //remove blogs
  await blogRepository!.removeMultiple(
    blogsToRemove.map((blog) => blog!.blogId)
  );

  //remove user
  return await userRepository!.remove(userId);
};
