const { validationResult } = require("express-validator");

const Validate = (req, res, next) => {
  let body = req.body;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  let UniqueErrors = errors.array().filter((error, index, self) => {
    return (
      index ===
      self.findIndex((t) => {
        return t.path === error.path;
      })
    );
  });

  return res.status(400).json({
    errors: UniqueErrors.map((error) => {
      return {
        value: error.path,
        message: error.msg,
      };
    }),
  });
};

const MulterFileSizeExceed = (size) => {
  return (err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        errors: [
          {
            value: err.field,
            message: "exceeded image size of " + size,
          },
        ],
      });
    }
    next();
  };
};

module.exports = { Validate, MulterFileSizeExceed };
