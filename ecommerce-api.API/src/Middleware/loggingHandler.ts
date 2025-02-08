import { Request, Response, NextFunction } from "express";

// Middleware function for logging HTTP requests and responses
export function loggingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log information about the incoming request
  logging.info(
    `Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  // Add a listener for the 'finish' event on the response object
  res.on("finish", () => {
    // Log information about the completed request, including the response status
    logging.info(
      `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
    );
  });

  // Call the next middleware in the chain
  next();
}