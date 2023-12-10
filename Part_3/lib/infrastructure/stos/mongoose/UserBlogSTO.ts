import UserBlog from "../../../domain/entities/UserBlog";

export default (schemaEntity: any): UserBlog | null => {
  if (!schemaEntity) return null;
  return new UserBlog({
    id: schemaEntity.id,
    userId: schemaEntity.userId.toString(),
    blogId: schemaEntity.blogId.toString(),
  });
};
