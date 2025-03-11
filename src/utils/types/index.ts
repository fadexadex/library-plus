import { Prisma } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: IPayload;
    }
  }
}

export interface ILoginBody {
  email: string;
  password: string;
}

export type IPayload = {
  userId: string;
  email: string;
  role: string;
}