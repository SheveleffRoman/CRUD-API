import http, { IncomingMessage, ServerResponse } from "http";
import { ERROR_MESSAGES } from "../constants/messages";
import {
  createResponseObject,
  handleGetRequest,
  handlePostResponse,
  handlePutResponse,
} from "../api/apiHandlers";
import { HTTP_STATUS_CODES } from "../constants/statusCodes";

function createAPIServer() {
  return http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    const body: Buffer[] = [];
    req
      .on("data", (chunk: Buffer) => {
        body.push(chunk);
      })
      .on("end", () => {
        const requestBody = Buffer.concat(body).toString();

        let responseObj = createResponseObject(
          HTTP_STATUS_CODES.NOT_FOUND,
          JSON.stringify(ERROR_MESSAGES.RESOURCE_NOT_EXIST)
        );

        try {
          if (method === "GET") {
            responseObj = handleGetRequest(url);
          }

          if (method === "POST" && url === "/api/users") {
            responseObj = handlePostResponse(requestBody);
          }

          if (method === "PUT" && url?.startsWith("/api/users/")) {
            responseObj = handlePutResponse(url, requestBody);
          }


        } catch {
          responseObj = createResponseObject(
            HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            JSON.stringify(ERROR_MESSAGES.INTERNAL_SERVER_ERROR_MESSAGE)
          );
        }

        res.writeHead(responseObj.statusCode, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });

        res.end(responseObj.response);
      });
  });
}

export default createAPIServer;
