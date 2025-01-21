import "express";

declare module "express-serve-static-core" {
  export interface Response {
    /** Custom method that sends json HTTP response in a consistent structure */
    respond: (data: any) => void;
  }
}
