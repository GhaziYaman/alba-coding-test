const allowedOrigins = require("../config/allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    // if (allowedOrigins.includes(origin) || !origin) {
    //   callback(null, true);
    // } else {
    //   callback(new Error("Origin not allowed by CORS"));
    // }
    callback(null, true);
  },
  credentials: "include",
};

module.exports = corsOptions;
