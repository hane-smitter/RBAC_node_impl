import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";

// Define the response structure type
interface IResponseStructure {
  status: "success" | "failure";
  data: any | null;
  error: { details: any; message: string; stack?: string } | null;
}

// Middleware to set consistent JSON response
const responseStructure = (req: Request, res: Response, next: NextFunction) => {
  const structuredResponse: IResponseStructure = {
    status: "success",
    data: null,
    error: null,
  };

  function isErrorStatusCode(statusCode: number): boolean {
    return statusCode >= 400;
  }

  // Create custom method on `res` object to ensure consistent structure to HTTP responses send
  res.respond = (data: any) => {
    // Pick status code set on response
    let responseStatus = res.statusCode;

    if (data instanceof CustomError) {
      structuredResponse.status = "failure";
      structuredResponse.error = {
        details: data.payload,
        message: data.message,
        ...(process.env.NODE_ENV === "developemnt" &&
          data.stack && { stack: data.stack }),
      };
      structuredResponse.data = null;

      if (data.statusCode) {
        responseStatus = isErrorStatusCode(data.statusCode)
          ? data.statusCode
          : 500;
      }

      responseStatus = isErrorStatusCode(responseStatus) ? responseStatus : 500; // Set status for error
    } else if (isErrorStatusCode(responseStatus)) {
      structuredResponse.status = "failure";
      structuredResponse.error = {
        details: data,
        message: "",
      };
      structuredResponse.data = null;
    } else {
      structuredResponse.data = data;
    }

    res.status(responseStatus).json(structuredResponse);
  };

  next();
};

export default responseStructure;
