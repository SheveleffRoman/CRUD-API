import http, { IncomingMessage, ServerResponse } from "http";
import { ERROR_MESSAGES } from "../constants/messages";
import { getGetResponse, getResponseObj } from "../api/apiHandlers";
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
        let responseObj = getResponseObj(
          HTTP_STATUS_CODES.NOT_FOUND,
          JSON.stringify(ERROR_MESSAGES.RESOURCE_NOT_EXIST)
        );

        try {
          if (method === "GET") {
            responseObj = getGetResponse(url);
          }
        } catch {
          responseObj = getResponseObj(
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
