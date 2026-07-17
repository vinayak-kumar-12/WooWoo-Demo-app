/**
 * Centralized Express Error Handling Middleware.
 * Logs error stack trace server-side and responds to client with formatted shape.
 * Ensures server implementation details and stacks are never leaked in production.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log server-side
  console.error(`[Error Handler] ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "An unexpected error occurred on the server"
      : err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
