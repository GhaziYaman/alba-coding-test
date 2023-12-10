import UserBlog from "../../../domain/entities/UserBlog";
import MongooseUserBlog from "../../orm/mongoose/schemas/UserBlog";
import UserBlogRepository from "../../../domain/repositories/UserBlogRepository";
import UserBlogSTO from "../../stos/mongoose/UserBlogSTO";
import { ID } from "../../../domain/entities/Entity";

export default class UserBlogRepositoryMongo implements UserBlogRepository {
  async persist(domainEntity: UserBlog): Promise<UserBlog | null> {
    const { userId, blogId } = domainEntity;
    const mongooseUserBlog = new MongooseUserBlog({
      userId,
      blogId,
    });
    await mongooseUserBlog.save();
    return UserBlogSTO(mongooseUserBlog);
  }
  async merge(domainEntity: UserBlog): Promise<UserBlog | null> {
    const { id, userId, blogId } = domainEntity;
    const mongooseUserBlog = await MongooseUserBlog.findByIdAndUpdate(
      id,
      {
        user_id: userId,
        blog_id: blogId,
      },
      {
        new: true,
      }
    );
    return UserBlogSTO(mongooseUserBlog);
  }

  async remove(entityId: ID): Promise<boolean | null> {
    return MongooseUserBlog.findOneAndDelete({ _id: entityId });
  }

  async get(entityId: ID): Promise<UserBlog | null> {
    const mongooseUserBlog = await MongooseUserBlog.findById(entityId);
    if (!mongooseUserBlog) return null;
    return UserBlogSTO(mongooseUserBlog);
  }

  async getByBlogId(blogId: ID): Promise<(UserBlog | null)[]> {
    const mongooseUserBlog = await MongooseUserBlog.find({ blog_id: blogId });
    if (!mongooseUserBlog) return [];
    let userBlogs = mongooseUserBlog.map((userBlog: any) =>
      UserBlogSTO(userBlog)
    );
    return userBlogs;
  }
  async getByUserId(userId: ID): Promise<(UserBlog | null)[]> {
    const mongooseUserBlog = await MongooseUserBlog.find({ user_id: userId });
    if (!mongooseUserBlog) return [];
    let userBlogs = mongooseUserBlog.map((userBlog: any) =>
      UserBlogSTO(userBlog)
    );
    return userBlogs;
  }

  async getByBlogIdAndUserId(blogId: ID, userId: ID): Promise<UserBlog | null> {
    const mongooseUserBlog = await MongooseUserBlog.findOne({
      blog_id: blogId,
      user_id: userId,
    });
    if (!mongooseUserBlog) return null;
    return UserBlogSTO(mongooseUserBlog);
  }

  async find(): Promise<(UserBlog | null)[]> {
    const mongooseUserBlogs = await MongooseUserBlog.find();
    return mongooseUserBlogs.map((mongooseUserBlog) =>
      UserBlogSTO(mongooseUserBlog)
    );
  }

  async removeAllUserBlogsByUserId(userId: ID): Promise<(UserBlog | null)[]> {
    try {
      let mongooseUserBlogs = await MongooseUserBlog.find({
        userId: userId,
      });
      if (!mongooseUserBlogs) return [];
      let blogs = mongooseUserBlogs.map((userBlog: any) =>
        UserBlogSTO(userBlog)
      );
      await MongooseUserBlog.deleteMany({
        userId,
      });
      return blogs;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
