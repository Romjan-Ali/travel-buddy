import type { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { sendResponse } from "../utils/helpers";

export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues[0];
        return sendResponse(
          res,
          400,
          "Validation failed",
          undefined,
          firstIssue?.message ?? "Invalid request data"
        );
      }

      return sendResponse(res, 400, "Invalid request data");
    }
  };
};
