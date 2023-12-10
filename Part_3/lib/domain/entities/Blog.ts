import { Mongoose } from "mongoose";
import Entity, { ID } from "./Entity";

export default class Blog extends Entity {
  title: string;
  description: string;
  main_image: string;
  additional_images: string[];
  date_time: Date;
  title_slug: string;

  constructor({
    id,
    title,
    description,
    main_image,
    additional_images,
    date_time,
    title_slug,
  }: {
    id?: ID;
    title: string;
    description: string;
    main_image: string;
    additional_images: string[];
    date_time: Date;
    title_slug: string;
  }) {
    super({ id });
    this.title = title;
    this.description = description;
    this.main_image = main_image;
    this.additional_images = additional_images;
    this.date_time = date_time;
    this.title_slug = title_slug;
  }
}
