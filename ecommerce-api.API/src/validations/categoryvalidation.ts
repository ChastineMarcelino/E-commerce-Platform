import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Define Joi validation schema
const categoryValidationSchema = Joi.object({
  categoryName: Joi.string().max(100).required().messages({
    "string.max": "Category name cannot exceed 100 characters",
    "any.required": "Category name is required",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
});

// ✅ Helper function to validate category data
export const validateCategoryData = (data: any) => {
  return categoryValidationSchema.validate(data, { abortEarly: false });
};

// ✅ Middleware version for routes
export const validateCategoryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateCategoryData(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  next();
};
