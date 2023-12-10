const request = require("supertest");
const app = require("../index");
const path = require("path");
const exp = require("constants");

describe("POST /blog/create", () => {
  it("should create a blog post with valid data", async () => {
    const image = path.resolve(__dirname, `./testimages/10000.jpg`);
    const image2 = path.resolve(__dirname, `./testimages/10009.jpg`);
    const image3 = path.resolve(__dirname, `./testimages/10000.jpg`);
    const date_time = Math.floor(Date.now() / 1000) + 1000 * 60;
    const response = await request(app)
      .post("/blog/create")
      .field("title", "Valid Title")
      .field("description", "Valid Description")
      .attach("main_image", image)
      .attach("additional_images", image2)
      .attach("additional_images", image3)
      .field("date_time", date_time)
      .expect(201);

    expect(response.body).toHaveProperty(
      "message",
      "Blog post created successfully"
    );
    expect(response.body.data).toHaveProperty("title", "Valid Title");
    expect(response.body.data).toHaveProperty(
      "description",
      "Valid Description"
    );
    expect(response.body.data).toHaveProperty("main_image");
    expect(response.body.data).toHaveProperty("additional_images");
    expect(response.body.data).toHaveProperty("date_time", date_time);
  });

  it("should create a blog post with missing data", async () => {
    const image = path.resolve(__dirname, `./testimages/10000.jpg`);
    const image2 = path.resolve(__dirname, `./testimages/10009.jpg`);
    const image3 = path.resolve(__dirname, `./testimages/10000.jpg`);
    const date_time = Math.floor(Date.now() / 1000) + 1000 * 60;
    const response = await request(app)
      .post("/blog/create")
      .attach("main_image", image)
      .attach("additional_images", image2)
      .attach("additional_images", image3)
      .field("date_time", date_time)
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: "title",
        }),
      ])
    );
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: "description",
        }),
      ])
    );
  });

  it("should create a blog post with a big image as main", async () => {
    const image = path.resolve(__dirname, `./testimages/bigimage.jpg`);
    const image2 = path.resolve(__dirname, `./testimages/10009.jpg`);
    const image3 = path.resolve(__dirname, `./testimages/10000.jpg`);
    const date_time = Math.floor(Date.now() / 1000) + 1000 * 60;
    const response = await request(app)
      .post("/blog/create")
      .field("title", "Valid Title")
      .field("description", "Valid Description")
      .attach("main_image", image)
      .attach("additional_images", image2)
      .attach("additional_images", image3)
      .field("date_time", date_time)
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: "main_image",
          message: "exceeded image size of 1MB",
        }),
      ])
    );
  });

  it("should create a blog post with a title that has special characters", async () => {
    const image = path.resolve(__dirname, `./testimages/10000.jpg`);
    const image2 = path.resolve(__dirname, `./testimages/10009.jpg`);
    const image3 = path.resolve(__dirname, `./testimages/10000.jpg`);
    const date_time = Math.floor(Date.now() / 1000) + 1000 * 60;
    const response = await request(app)
      .post("/blog/create")
      .field("title", "Valid Title!@#$%^&*()")
      .field("description", "Valid Description")
      .attach("main_image", image)
      .attach("additional_images", image2)
      .attach("additional_images", image3)
      .field("date_time", date_time)
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: "title",
          message: "Title cannot contain special characters",
        }),
      ])
    );
  });

  it("should create a blog post with a date_time that is not unix", async () => {
    const image = path.resolve(__dirname, `./testimages/10000.jpg`);
    const image2 = path.resolve(__dirname, `./testimages/10009.jpg`);
    const image3 = path.resolve(__dirname, `./testimages/10000.jpg`);
    const date_time = Math.floor(Date.now() / 1000) + 1000 * 60;
    const response = await request(app)
      .post("/blog/create")
      .field("title", "Valid Title")
      .field("description", "Valid Description")
      .attach("main_image", image)
      .attach("additional_images", image2)
      .attach("additional_images", image3)
      .field("date_time", "12/8/2023")
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: "date_time",
          message: "Date time is not unix timestamp",
        }),
      ])
    );
  });

  it("should create a blog post with valid data then check if it exists", async () => {
    const image = path.resolve(__dirname, `./testimages/10000.jpg`);
    const image2 = path.resolve(__dirname, `./testimages/10009.jpg`);
    const image3 = path.resolve(__dirname, `./testimages/10000.jpg`);
    const date_time = Math.floor(Date.now() / 1000) + 1000 * 60;

    const randomNumber = Math.floor(Math.random() * 1000000);
    // Random number addded to make sure it is a unique title

    const response = await request(app)
      .post("/blog/create")
      .field("title", "Valid Title" + randomNumber)
      .field("description", "Valid Description")
      .attach("main_image", image)
      .attach("additional_images", image2)
      .attach("additional_images", image3)
      .field("date_time", date_time)
      .expect(201);

    expect(response.body).toHaveProperty(
      "message",
      "Blog post created successfully"
    );

    const response2 = await request(app).get("/blog/all").expect(200);

    //expect one of the objects in the array to have the same title as the one we created
    expect(response2.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Valid Title" + randomNumber,
        }),
      ])
    );
  });

  it("should create a blog post with missing data and the check that is does not exist", async () => {
    const image = path.resolve(__dirname, `./testimages/10000.jpg`);
    const image2 = path.resolve(__dirname, `./testimages/10009.jpg`);
    const image3 = path.resolve(__dirname, `./testimages/10000.jpg`);
    const date_time = Math.floor(Date.now() / 1000) + 1000 * 60;

    const randomNumber = Math.floor(Math.random() * 1000000);

    const response = await request(app)
      .post("/blog/create")
      .field("title", "Valid Title" + randomNumber)
      .attach("main_image", image)
      .attach("additional_images", image2)
      .attach("additional_images", image3)
      .field("date_time", date_time)
      .expect(400);

    const response2 = await request(app).get("/blog/all").expect(200);

    expect(response2.body).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          title: "Valid Title" + randomNumber,
        }),
      ])
    );
  });
});
