import UserBlog from "../entities/UserBlog";
import { ID } from "../entities/Entity";

export default interface UserBlogRepository {
  persist(domainEntity: UserBlog): Promise<UserBlog | null>;

  merge(domainEntity: UserBlog): Promise<UserBlog | null>;

  remove(entityId: ID): Promise<boolean | null>;

  get(entityId: ID): Promise<UserBlog | null>;

  getByUserId(userId: ID): Promise<(UserBlog | null)[]>;

  getByBlogId(blogId: ID): Promise<(UserBlog | null)[]>;

  find(): Promise<(UserBlog | null)[]>;

  getByBlogIdAndUserId(blogId: ID, userId: ID): Promise<UserBlog | null>;

  removeAllUserBlogsByUserId(userId: ID): Promise<(UserBlog | null)[]>;
}
