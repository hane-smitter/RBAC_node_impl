export class CustomError extends Error {
  /** Name of the error */
  name: string;
  /** Data details about the error */
  payload: any;

  /**
   * @param message Error message. __NOTE:__ Exercise using _user-friendly_ messages.
   * @param payload Sets more information for the error
   */
  constructor(message: string, payload?: any) {
    super(message);
    this.name = "CustomError";
    this.payload = payload;
  }
}
