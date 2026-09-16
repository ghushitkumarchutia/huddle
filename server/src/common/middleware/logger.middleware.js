const getMethodColor = (method) => {
  switch (method) {
    case "GET":
      return "\x1b[32m";
    case "POST":
      return "\x1b[34m";
    case "PUT":
    case "PATCH":
      return "\x1b[33m";
    case "DELETE":
      return "\x1b[31m";
    default:
      return "\x1b[37m";
  }
};

const getStatusColor = (status) => {
  if (status >= 500) return "\x1b[31m";
  if (status >= 400) return "\x1b[33m";
  if (status >= 300) return "\x1b[36m";
  if (status >= 200) return "\x1b[32m";
  return "\x1b[37m";
};

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const methodColor = getMethodColor(req.method);
    const statusColor = getStatusColor(res.statusCode);
    const reset = "\x1b[0m";

    console.log(
      `\x1b[90m[${timestamp}]\x1b[0m ${methodColor}${req.method}${reset} ${req.originalUrl} ${statusColor}${res.statusCode}${reset} - \x1b[90m${duration}ms\x1b[0m`,
    );
  });

  next();
};

export default loggerMiddleware;
