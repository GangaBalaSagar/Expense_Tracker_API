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

    if (!Array.isArray(parsedExpenses)) {
      throw new Error(`Invalid expenses data in ${expensesFilePath}: expected a JSON array.`);
    }

    return parsedExpenses;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse expenses data from ${expensesFilePath}: malformed JSON.`);
    }

    if (error.message && error.message.indexOf("Invalid expenses data in") === 0) {
      throw error;
    }

    throw new Error(`Failed to read expenses data from ${expensesFilePath}: ${error.message}`);
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
