const jwt = require("jsonwebtoken");
require("dotenv").config();

const VerifyJWT = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(400).json({ error: "Missing token" });
    if (!req.headers.authorization.startsWith("Bearer "))
      return res.status(400).json({ error: "Missing token" });
    // Token should be in header not as input

    const token = req.headers.authorization.split(" ")[1];
    req.body.token = token;

    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
    req.image_path = decoded.image_path;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Invalid token",
    });
  }
};

module.exports = { VerifyJWT };
