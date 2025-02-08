import { Request, Response, NextFunction } from "express";

// This function is a middleware for handling routes that are not found
export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  // Create a new Error object with the message "Not found"
  const error = new Error("Not found");

  // Log the error as a warning (Note: 'logging' is not imported in this snippet,
  // so make sure it's properly imported or defined elsewhere)
  logging.warning(error);

  // Send a 404 status code with a JSON response
  res.status(404).json({
    error: {
      message: error.message,
    },
  });
}