import db from "../services/db";
import { isValidUUID } from "../utils/uuidValidator";

import { RequestUrl, User } from "../interfaces";
import { ERROR_MESSAGES } from "../constants/messages";
import { HTTP_STATUS_CODES } from "../constants/statusCodes";

function getResponseObj(statusCode: number, response: string) {
  return {
    statusCode,
    response,
  };
}

function getGetResponse(url: RequestUrl) {
  if (url === "/api/users") {
    const users = db.getUsers();

    return getResponseObj(HTTP_STATUS_CODES.OK, JSON.stringify(users));
  }

  if (url && url.startsWith("/api/users/")) {
    const userId = url.split("/api/users/").at(-1);

    if (!isValidUUID(userId)) {
      return getResponseObj(
        HTTP_STATUS_CODES.BAD_REQUEST,
        JSON.stringify(ERROR_MESSAGES.INVALID_ID)
      );
    }
    const user = db.getUser(userId!);

    return user
      ? getResponseObj(HTTP_STATUS_CODES.OK, JSON.stringify(user))
      : getResponseObj(
          HTTP_STATUS_CODES.NOT_FOUND,
          JSON.stringify(ERROR_MESSAGES.USER_NOT_FOUND)
        );
  }

  return getResponseObj(
    HTTP_STATUS_CODES.NOT_FOUND,
    JSON.stringify(ERROR_MESSAGES.RESOURCE_NOT_EXIST)
  );
}

export { getResponseObj, getGetResponse };
