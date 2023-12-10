import Blog from "../../../domain/entities/Blog";
import MoongooseBlog from "../../orm/mongoose/schemas/Blog";
import BlogRepository from "../../../domain/repositories/BlogRepository";
import BlogSTO from "../../stos/mongoose/BlogSTO";
import { ID } from "../../../domain/entities/Entity";

export default class BlogRepositoryMongo implements BlogRepository {
  async persist(domainEntity: Blog): Promise<Blog | null> {
    const {
      title,
      description,
      main_image,
      additional_images,
      date_time,
      title_slug,
    } = domainEntity;
    const mongooseBlog = new MoongooseBlog({
      title,
      description,
      main_image: main_image,
      additional_images: additional_images,
      date_time: date_time,
      title_slug: title_slug,
    });
    await mongooseBlog.save();
    return BlogSTO(mongooseBlog);
  }

  async merge(domainEntity: Blog): Promise<Blog | null> {
    const {
      id,
      title,
      description,
      main_image,
      additional_images,
      date_time,
      title_slug,
    } = domainEntity;
    const mongooseBlog = await MoongooseBlog.findByIdAndUpdate(
      id,
      {
        title,
        description,
        main_image: main_image,
        additional_images: additional_images,
        date_time: date_time,
        title_slug: title_slug,
      },
      {
        new: true,
      }
    );
    return BlogSTO(mongooseBlog);
  }

  async remove(entityId: ID): Promise<boolean | null> {
    return MoongooseBlog.findOneAndDelete({ _id: entityId });
  }

  async get(entityId: ID): Promise<Blog | null> {
    const mongooseBlog = await MoongooseBlog.findById(entityId);
    if (!mongooseBlog) return null;
    return BlogSTO(mongooseBlog);
  }

  async getBySlug(title_slug: string): Promise<Blog | null> {
    const mongooseBlog = await MoongooseBlog.findOne({ title_slug });
    if (!mongooseBlog) return null;
    return BlogSTO(mongooseBlog);
  }

  async find(): Promise<Blog[]> {
    const mongooseBlogs = await MoongooseBlog.find().sort({ createdAt: -1 });
    return mongooseBlogs
      .map((mongooseBlog) => BlogSTO(mongooseBlog))
      .filter((blog: Blog | null): blog is Blog => blog != null);
  }

  async removeMultiple(entityIds: ID[]): Promise<void> {
    await MoongooseBlog.deleteMany({ _id: { $in: entityIds } });
  }
}
