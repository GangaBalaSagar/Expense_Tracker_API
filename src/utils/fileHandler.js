const path = require("path");
const { promises: fs } = require("fs");

const expensesFilePath = path.join(__dirname, "..", "..", "expenses.json");

async function readExpenses() {
  try {
    const fileContents = await fs.readFile(expensesFilePath, "utf8");

    if (!fileContents.trim()) {
      return [];
    }

    const parsedExpenses = JSON.parse(fileContents);

    return Array.isArray(parsedExpenses) ? parsedExpenses : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    return [];
  }
}

async function writeExpenses(expenses) {
  const formattedExpenses = JSON.stringify(expenses, null, 2);

  await fs.writeFile(expensesFilePath, formattedExpenses, "utf8");
}

module.exports = {
  readExpenses,
  writeExpenses,
};
