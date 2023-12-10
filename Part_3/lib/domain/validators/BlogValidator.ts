import Joi from "joi";

// 1) title (Min 5 characters, Max 50 characters, No special characters, REQUIRED)
// 2) description (Max 500 characters, REQUIRED)
// 3) main_image (ONLY jpg, MAX size 1MB, REQUIRED)
// 4) additional_images (ONLY jpg, Multiple, MAX size 1MB per image, MAX number of images 5, OPTIONAL)
// 5) date_time (should be unix time, and not before now, REQUIRED)

export default Joi.object({
  title: Joi.string()
    .label("title")
    .alter({
      create: (schema) => schema.pattern(/^[a-zA-Z0-9 ]{5,50}$/),
      update: (schema) => schema.pattern(/^[a-zA-Z0-9 ]{5,50}$/),
    })
    .required(),
  description: Joi.string().label("description").max(500).required(),
  main_image: Joi.string().label("main_image").required(),
  additional_images: Joi.array()
    .label("additional_images")
    .items(Joi.string())
    .max(5)
    .optional(),
  date_time: Joi.number()
    .label("date_time")
    .min(Date.now() / 1000)
    .messages({
      "number.min": "date_time should be after now in unix time",
    })
    .required(),
}).unknown();
