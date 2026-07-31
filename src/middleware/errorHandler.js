function errorHandler(err, req, res, next) {
  const statusCode = Number.isInteger(err?.statusCode)
    ? err.statusCode
    : Number.isInteger(err?.status)
      ? err.status
      : 500;

  const hasPublicMessage = typeof err?.publicMessage === "string" && err.publicMessage.trim();
  const shouldExposeMessage = statusCode < 500 || err?.expose === true || hasPublicMessage;

  const response = {
    success: false,
    message: hasPublicMessage
      ? err.publicMessage
      : shouldExposeMessage && typeof err?.message === "string" && err.message.trim()
        ? err.message
        : "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production" && typeof err?.message === "string" && err.message.trim()) {
    response.error = err.message;
  }

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;
