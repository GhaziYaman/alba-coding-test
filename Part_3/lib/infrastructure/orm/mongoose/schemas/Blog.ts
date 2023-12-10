import mongoose from "../mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    main_image: {
      type: String,
      required: true,
    },
    additional_images: {
      type: [String],
      required: false,
      default: [],
    },
    date_time: {
      type: Date,
      required: true,
    },
    title_slug: String,
  },
  { timestamps: true }
);

schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

export default mongoose.model("Blog", schema);
