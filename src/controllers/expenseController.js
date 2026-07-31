const crypto = require("crypto");
const { readExpenses, writeExpenses } = require("../utils/fileHandler");

function generateExpenseId() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${process.pid}`;
}

function normalizeCategory(category) {
  return typeof category === "string" ? category.trim().toLowerCase() : "";
}

function filterExpensesByCategory(expenses, category) {
  const normalizedCategory = normalizeCategory(category);

  if (!normalizedCategory) {
    return expenses;
  }

  return expenses.filter((expense) => {
    if (typeof expense.category !== "string") {
      return false;
    }

    return normalizeCategory(expense.category) === normalizedCategory;
  });
}

function calculateTotal(expenses) {
  return expenses.reduce((total, expense) => {
    if (typeof expense.amount !== "number" || !Number.isFinite(expense.amount)) {
      return total;
    }

    return total + expense.amount;
  }, 0);
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
    const { category } = req.query;
    const filteredExpenses = filterExpensesByCategory(expenses, category);

    return res.status(200).json({
      success: true,
      count: filteredExpenses.length,
      data: filteredExpenses,
    });
  } catch (error) {
    return next(error);
  }
}

async function getExpenseTotal(req, res, next) {
  try {
    const expenses = await readExpenses();
    const { category } = req.query;
    const filteredExpenses = filterExpensesByCategory(expenses, category);
    const total = calculateTotal(filteredExpenses);
    const hasCategory = typeof category === "string" && category.trim();

    return res.status(200).json({
      success: true,
      category: hasCategory ? category.trim() : "All",
      total,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const expenses = await readExpenses();
    const expenseIndex = expenses.findIndex((expense) => expense.id === req.params.id);

    if (expenseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    expenses.splice(expenseIndex, 1);
    await writeExpenses(expenses);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addExpense,
  getAllExpenses,
  getExpenseTotal,
  deleteExpense,
};
