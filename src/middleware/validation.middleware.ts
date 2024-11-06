import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

// Define a constructor type
// Below type means "something that can be called with 'new' to create an instance of type T".(A Class definition type)
type Constructor<T> = new (...args: any[]) => T;

export function validationMiddleware<T extends object>(
  dtoClass: Constructor<T>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body || {});
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        // field: error.property,
        // constraints: error.constraints,
        [error.property]: Object.values(error.constraints || {}),
      }));
      res.status(400).json({
        status: "failed",
        message: "Validation failed",
        errors: formattedErrors,
      });
      return;
    }

    req.body = dtoInstance;
    next();
  };
}
