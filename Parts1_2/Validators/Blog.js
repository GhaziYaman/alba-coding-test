const { body } = require("express-validator");
const moment = require("moment");

exports.BlogValidator = {
  createBlog: [
    body("title")
      .isLength({ min: 5, max: 50 })
      .custom((value, { req }) => {
        if (!/^[a-zA-Z0-9 ]*$/.test(value)) {
          throw new Error("Title cannot contain special characters");
        }
        return true;
      })
      .notEmpty(),
    body("description").isLength({ max: 500 }).notEmpty(),
    body("date_time").custom((value) => {
      if (!moment.unix(value).isValid()) {
        throw new Error("Date time is not unix timestamp");
      }
      if (moment.unix(value).isBefore(moment())) {
        throw new Error("Date time cannot be in the past");
      }
      return true;
    }),
    body("main_image").custom((value, { req }) => {
      if (req.files["main_image"] === undefined) {
        throw new Error("Main Image is required");
      }
      return true;
    }),
  ],
};
