const fs = require("fs");

exports.DATABASE_SERVICE = {
  getDataBlogs() {
    let blogsData = [];
    try {
      const existingData = fs.readFileSync(
        __dirname + "/../blogs.json",
        "utf8"
      );
      blogsData = JSON.parse(existingData);
      return blogsData;
    } catch (error) {
      fs.writeFileSync(
        __dirname + "/../blogs.json",
        JSON.stringify([], null, 2)
      );
      return [];
    }
  },
  pushBlog(blog) {
    let blogsData = this.getDataBlogs();
    blog.referenceNumber = blogsData.length + 1;
    blogsData.push(blog);
    fs.writeFileSync(
      __dirname + "/../blogs.json",
      JSON.stringify(blogsData, null, 2)
    );
  },
};
