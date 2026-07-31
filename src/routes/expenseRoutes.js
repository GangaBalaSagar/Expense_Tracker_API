const express = require("express");
const validateExpense = require("../middleware/validateExpense");
const { addExpense } = require("../controllers/expenseController");

const router = express.Router();

router.post("/", validateExpense, addExpense);

module.exports = router;
