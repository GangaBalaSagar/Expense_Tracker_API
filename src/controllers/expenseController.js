const crypto = require("crypto");
const { readExpenses, writeExpenses } = require("../utils/fileHandler");

function generateExpenseId() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${process.pid}`;
}

async function addExpense(req, res, next) {
  try {
    const expenses = await readExpenses();
    const expense = {
      id: generateExpenseId(),
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date,
    };

    expenses.push(expense);
    await writeExpenses(expenses);

    return res.status(201).json({
      success: true,
      message: "Expense added successfully.",
      data: expense,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAllExpenses(req, res, next) {
  try {
    const expenses = await readExpenses();

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addExpense,
  getAllExpenses,
};
