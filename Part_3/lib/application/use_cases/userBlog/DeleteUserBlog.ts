import { ID } from "../../../domain/entities/Entity";
import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default (userBlogId: ID, { userBlogRepository }: ServiceLocator) =>
  userBlogRepository!.remove(userBlogId);
