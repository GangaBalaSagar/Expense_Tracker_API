const express = require("express");
const expenseRoutes = require("./routes/expenseRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API Running" });
});

app.use("/expenses", expenseRoutes);
app.use(errorHandler);

module.exports = app;
