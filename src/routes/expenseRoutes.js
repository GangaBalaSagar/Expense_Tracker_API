const express = require("express");
const validateExpense = require("../middleware/validateExpense");
const { addExpense, getAllExpenses } = require("../controllers/expenseController");

const router = express.Router();

router.get("/", getAllExpenses);
router.post("/", validateExpense, addExpense);

module.exports = router;
