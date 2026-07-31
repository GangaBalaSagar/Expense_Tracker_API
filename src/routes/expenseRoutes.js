const express = require("express");
const validateExpense = require("../middleware/validateExpense");
const { addExpense, getAllExpenses, getExpenseTotal, deleteExpense } = require("../controllers/expenseController");

const router = express.Router();

router.get("/total", getExpenseTotal);
router.get("/", getAllExpenses);
router.delete("/:id", deleteExpense);
router.post("/", validateExpense, addExpense);

module.exports = router;
