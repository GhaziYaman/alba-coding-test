const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const corsOptions = require("./config/corsOptions");
const server = http.createServer(app);

global.__basedir = __dirname + "/";
app.use(function (req, res, next) {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(200);
});

app.use("/blog", require("./Routes/blogRoutes"));
app.use("/image", require("./Routes/imageRoutes"));

const PORT = process.env.SERVER_PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
  });
}

module.exports = app;
