import Joi from "joi";

export const chatQuerySchema = Joi.object({
  query: Joi.string().trim().min(1).required().messages({
    "string.base": "Query must be a string.",
    "string.empty": "Query cannot be empty.",
    "string.min": "Query must contain at least 1 character.",
    "any.required": "Query is required.",
  }),
});