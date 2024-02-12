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

    return createResponseObject(HTTP_STATUS_CODES.CREATED, JSON.stringify(newUser));
  }
}

export {
  createResponseObject,
  handleGetRequest,
  handlePostResponse,

};
