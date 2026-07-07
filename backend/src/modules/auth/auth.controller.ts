import { Request, Response } from "express";
import * as authService from "./auth.service";

export const register = async (
  req: Request,
  res: Response
) => {
  const result = await authService.register(
    req.body.name,
    req.body.email,
    req.body.password
  );

  res.status(201).json(result);
};

export const login = async (
  req: Request,
  res: Response
) => {
  const result = await authService.login(
    req.body.email,
    req.body.password
  );

  res.json(result);
};

export const me = async (
    req: Request,
    res: Response
) => {

    res.json({
        user: (req as any).user
    });

};