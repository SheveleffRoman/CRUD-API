// import { ERROR_MESSAGES } from "../constants/messages";
import { HTTP_STATUS_CODES } from "../constants/statusCodes";
import * as handlers from "../api/apiHandlers";
import server from "../index";
import request from "supertest";
import { ERROR_MESSAGES } from "../constants/messages";

afterAll((done) => {
  server.close(() => {
    done();
  });
});

describe("Create and delete user scenario test", () => {
  let createdUserId: string;

  it("Empty User List Test (GET api/users)", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("Create a user through the API endpoint /api/users", async () => {
    const newUser = {
      username: "Alex",
      age: 20,
      hobbies: ["tennis", "football"],
    };

    const response = await request(server).post("/api/users").send(newUser);
    const allUsersResponse = await request(server).get("/api/users");

    createdUserId = response.body?.id;

    expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(allUsersResponse.body).toEqual([
      {
        ...newUser,
        id: createdUserId,
      },
    ]);
  });

  it("DELETE /users/{userId} - Responds with status code 204 on successful deletion.", async () => {
    const response = await request(server).delete(
      `/api/users/${createdUserId}`
    );
    expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
  });

  it("GET /users/{userId} - Responds with status code 404 and corresponding message if user is not found", async () => {
    const response = await request(server).get(`/api/users/${createdUserId}`);
    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(ERROR_MESSAGES.USER_NOT_FOUND.message);
  });
});

describe("API error scenario", () => {
  it("GET /nonexistent-resource - Responds with status code 404 and corresponding message.", async () => {
    const response = await request(server).get("/bla/bla/bla");

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      ERROR_MESSAGES.RESOURCE_NOT_EXIST.message
    );
  });

  test("GET api/users - handles server error correctly", async () => {
    jest.spyOn(handlers, "handleGetRequest").mockImplementation(() => {
      throw new Error("Error updating user");
    });

    const response = await request(server).get("/api/users");

    expect(response.status).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE.message
    );
  });
});
