import { Request, Response } from "express";

export const getHealth = (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    success: true,
    message: "SprintHub API is running",
    version: "1.0.0"
  });
};