export class CustomError extends Error {
  /** Name of the error */
  name: string;
  /** Data details about the error */
  payload: any;
  /** Resultant HTTP status code of the error */
  statusCode: number;

  /**
   * @param message Error message. __NOTE:__ Exercise using _user-friendly_ messages.
   * @param payload Sets more information for the error
   * @param statusCode Sets HTTP status code(processes `400 - 599`) for the response
   */
  constructor(message: string, payload?: any, statusCode?: number) {
    super(message);
    this.name = "CustomError";
    this.payload = payload;

    if (statusCode && this.#isErrorStatusCode(statusCode)) {
      this.statusCode = statusCode;
    } else {
      this.statusCode = 500;
    }
  }

  #isErrorStatusCode(statusCode: number): boolean {
    return statusCode >= 400 && statusCode <= 599;
  }
}
