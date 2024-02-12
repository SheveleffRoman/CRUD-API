import { v4 as uuidv4 } from "uuid";
import db from "../services/db";
import { isValidUUID } from "../utils/uuidValidator";

import { RequestUrl, User } from "../interfaces";
import { ERROR_MESSAGES } from "../constants/messages";
import { HTTP_STATUS_CODES } from "../constants/statusCodes";

function createResponseObject(statusCode: number, response: string) {
  return {
    statusCode,
    response,
  };
}

function handleGetRequest(url: RequestUrl) {
  if (url === "/api/users") {
    const users = db.getUsers();

    return createResponseObject(HTTP_STATUS_CODES.OK, JSON.stringify(users));
  }

  if (url && url.startsWith("/api/users/")) {
    const userId = url.split("/api/users/").at(-1);

    if (!isValidUUID(userId)) {
      return createResponseObject(
        HTTP_STATUS_CODES.BAD_REQUEST,
        JSON.stringify(ERROR_MESSAGES.INVALID_ID)
      );
    }
    const user = db.getUser(userId!);

    return user
      ? createResponseObject(HTTP_STATUS_CODES.OK, JSON.stringify(user))
      : createResponseObject(
          HTTP_STATUS_CODES.NOT_FOUND,
          JSON.stringify(ERROR_MESSAGES.USER_NOT_FOUND)
        );
  }

  return createResponseObject(
    HTTP_STATUS_CODES.NOT_FOUND,
    JSON.stringify(ERROR_MESSAGES.RESOURCE_NOT_EXIST)
  );
}

function handlePostResponse(requestBody: string) {
  const { username, age, hobbies }: Partial<User> = JSON.parse(requestBody);

  if (!username || !age || !hobbies?.length || !Array.isArray(hobbies)) {
    return createResponseObject(
      HTTP_STATUS_CODES.BAD_REQUEST,
      JSON.stringify(ERROR_MESSAGES.MISSING_FIELDS)
    );
  } else {
    const newUser: User = {
      id: uuidv4(),
      username,
      age,
      hobbies: hobbies,
    };

    db.addUser(newUser);

    return createResponseObject(
      HTTP_STATUS_CODES.CREATED,
      JSON.stringify(newUser)
    );
  }
}

function handlePutResponse(url: string, requestBody: string) {
  const userId = url.split("/api/users/").at(-1);

  const { username, age, hobbies }: User = JSON.parse(requestBody);

  if (!isValidUUID(userId)) {
    return createResponseObject(
      HTTP_STATUS_CODES.BAD_REQUEST,
      JSON.stringify(ERROR_MESSAGES.INVALID_ID)
    );
  }

  const currentUser = db.getUser(userId!);

  if (!currentUser) {
    return createResponseObject(
      HTTP_STATUS_CODES.NOT_FOUND,
      JSON.stringify(ERROR_MESSAGES.USER_NOT_FOUND)
    );
  }

  const updatedUser: User = {
    id: currentUser.id,
    username: typeof username === "string" ? username : currentUser.username,
    age: typeof age === "number" ? age : currentUser.age,
    hobbies:
      Array.isArray(hobbies) && Array.length ? hobbies : currentUser.hobbies,
  };

  db.updateUser(updatedUser);

  return createResponseObject(200, JSON.stringify(updatedUser));
}


export {
  createResponseObject,
  handleGetRequest,
  handlePostResponse,
  handlePutResponse,
};
