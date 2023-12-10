const request = require("supertest");
const app = require("../index");
const path = require("path");
const exp = require("constants");

describe("POST /image", () => {
  it("should get a token for a valid image then get the image using the token", async () => {
    let imagePath = "testimage.jpg";
    const response = await request(app)
      .post("/image/generateToken")
      .field("image_path", imagePath)
      .expect(200);

    expect(response.body).toHaveProperty("token");

    const token = response.body.token;

    const response2 = await request(app)
      .post("/image/getImage")
      .field("token", token)
      .field("image_path", imagePath)
      .expect(200);

    expect(response2.body).toHaveProperty("image");
  });

  it("should get a token for a valid image then get the another image using this token and fail", async () => {
    let imagePath = "additional_1_1702155709496_10014.jpg";
    const response = await request(app)
      .post("/image/generateToken")
      .field("image_path", imagePath)
      .expect(200);

    expect(response.body).toHaveProperty("token");

    const token = response.body.token;

    const response2 = await request(app)
      .post("/image/getImage")
      .field("token", token)
      .field("image_path", "differentpath/image.jpg")
      .expect(400);

    expect(response2.body).toHaveProperty("error", "Invalid token");
  });
});
