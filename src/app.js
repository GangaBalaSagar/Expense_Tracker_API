const express = require("express");
const expenseRoutes = require("./routes/expenseRoutes");
const errorHandler = require("./middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../docs/swagger");

const app = express();
const swaggerMiddleware = [swaggerUi.serve, swaggerUi.setup(swaggerSpec)];

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API Running" });
});

app.use("/expenses", expenseRoutes);
app.use("/docs", ...swaggerMiddleware);
app.use("/api-docs", ...swaggerMiddleware);
app.use(errorHandler);

module.exports = app;
