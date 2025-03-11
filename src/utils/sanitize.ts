import { Prisma } from "@prisma/client";
import { generateToken } from "./jwt";

const sanitizeUserAndGrantToken = (data: Prisma.UserCreateInput) => {
  const payload = {
    userId: data.userId,
    email: data.email,
    role: data.role,
  };
  return { token: generateToken(payload) };
};

export default sanitizeUserAndGrantToken;
