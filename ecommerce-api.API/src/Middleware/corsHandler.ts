import { Request, Response, NextFunction } from "express";


export function corsHandler(req: Request, res: Response, next: NextFunction) {
  // Allow requests from the origin specified in the request header
  const origin = req.header("origin");
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Specify which headers are allowed in CORS requests
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Allow credentials to be sent with CORS requests (e.g., cookies)
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests (OPTIONS method)
  if (req.method === "OPTIONS") {
    // Specify which HTTP methods are allowed for CORS requests
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    // Respond to preflight request with 204 No Content status
    return res.sendStatus(204); // End the preflight request
  }

  // Move to the next middleware in the chain
  next();
}

