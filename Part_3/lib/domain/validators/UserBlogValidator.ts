import Joi from "joi";

export default Joi.object({
  userId: Joi.string().required(),
  blogId: Joi.string().required(),
}).unknown();
