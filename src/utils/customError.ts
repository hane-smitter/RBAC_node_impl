export class CustomError extends Error {
  /** Name of the error */
  name: string;
  /** Data details about the error */
  payload: any;
  /** Resultant HTTP status code of the error */
  statusCode: number;

  constructor(message: string, payload?: any, statusCode?: number) {
    super(message);
    this.name = "CustomError";
    this.payload = payload;

    if (statusCode && statusCode >= 400) {
      this.statusCode = statusCode;
    } else {
      this.statusCode = 500;
    }
  }
}
