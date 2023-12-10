import Entity, { ID } from "./Entity";

export default class UserBlog extends Entity {
  userId: ID;
  blogId: ID;

  constructor({ id, userId, blogId }: { id?: ID; userId: ID; blogId: ID }) {
    super({ id });
    this.userId = userId;
    this.blogId = blogId;
  }
}
