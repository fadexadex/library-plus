import { Request, Response, NextFunction } from "express";
export const parseCopiesAndPrice = (req: Request, res: Response, next: NextFunction) => {
  req.body.copies = parseInt(req.body.copies);
  req.body.price = parseFloat(req.body.price);
  next();
};
  