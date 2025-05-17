"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = routeNotFound;
// This function is a middleware for handling routes that are not found
function routeNotFound(req, res, next) {
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
