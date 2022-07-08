import { NextFunction, Request, Response } from "express";

export default function validateSchema(schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(500).send(error.details.map(detail => detail.message));
    }
  };
}
