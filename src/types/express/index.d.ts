import "express";

declare module "express-serve-static-core" {
  export interface Response {
    // respond: (data: any, success?: boolean, statusCode?: number) => void;
    /** Custom method to send  response in a consistent format */
    respond: (data: any) => void;
  }
}
