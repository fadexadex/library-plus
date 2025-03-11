import jwt from "jsonwebtoken";
import { IPayload } from "./types";

const generateToken = (payload: IPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  if (typeof decoded === "string") {
    throw new Error("Invalid token");
  }
  return decoded as IPayload;
};

export { generateToken, verifyToken };
