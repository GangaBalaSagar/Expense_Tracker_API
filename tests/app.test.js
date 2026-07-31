const path = require("path");
const fs = require("fs").promises;
const request = require("supertest");
const app = require("../src/app");

const expensesFilePath = path.join(__dirname, "..", "expenses.json");

async function readExpensesFile() {
  const fileContents = await fs.readFile(expensesFilePath, "utf8");
  return fileContents.trim() ? JSON.parse(fileContents) : [];
}

async function writeExpensesFile(expenses) {
  await fs.writeFile(expensesFilePath, JSON.stringify(expenses, null, 2), "utf8");
}

describe("Expense Tracker API", () => {
  let originalExpenses;

  beforeAll(async () => {
    originalExpenses = await fs.readFile(expensesFilePath, "utf8");
  });

  beforeEach(async () => {
    await writeExpensesFile([]);
  });

  afterAll(async () => {
    await fs.writeFile(expensesFilePath, originalExpenses, "utf8");
  });

  test("GET / returns the API running message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Expense Tracker API Running" });
  });

  test("POST /expenses creates a valid expense and writes it to disk", async () => {
    const payload = {
      title: "Lunch",
      amount: 250,
      category: "Food",
      date: "2026-07-31",
    };

    const response = await request(app).post("/expenses").send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toMatchObject(payload);

    const storedExpenses = await readExpensesFile();
    expect(storedExpenses).toHaveLength(1);
    expect(storedExpenses[0]).toMatchObject(payload);
    expect(storedExpenses[0]).toHaveProperty("id", response.body.data.id);
  });

  test("POST /expenses rejects an invalid expense payload", async () => {
    const response = await request(app).post("/expenses").send({
      title: " ",
      amount: 0,
      category: "",
      date: "bad-date",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  test("GET /expenses returns all stored expenses", async () => {
    const seedExpenses = [
      { id: "e1", title: "Lunch", amount: 250, category: "Food", date: "2026-07-31" },
      { id: "e2", title: "Taxi", amount: 500, category: "Travel", date: "2026-07-30" },
    ];

    await writeExpensesFile(seedExpenses);

    const response = await request(app).get("/expenses");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(response.body.data.length);
    expect(response.body.data).toEqual(seedExpenses);
  });

  test("GET /expenses?category=Food filters expenses case-insensitively", async () => {
    const seedExpenses = [
      { id: "e1", title: "Lunch", amount: 250, category: "Food", date: "2026-07-31" },
      { id: "e2", title: "Taxi", amount: 500, category: "Travel", date: "2026-07-30" },
      { id: "e3", title: "Snacks", amount: 100, category: "food", date: "2026-07-29" },
    ];

    await writeExpensesFile(seedExpenses);

    const response = await request(app).get("/expenses?category=Food");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(2);
    expect(response.body.data).toEqual([seedExpenses[0], seedExpenses[2]]);
  });

  test("GET /expenses/total returns the total for all expenses", async () => {
    const seedExpenses = [
      { id: "e1", title: "Lunch", amount: 250, category: "Food", date: "2026-07-31" },
      { id: "e2", title: "Taxi", amount: 500, category: "Travel", date: "2026-07-30" },
      { id: "e3", title: "Snacks", amount: 100, category: "food", date: "2026-07-29" },
    ];

    await writeExpensesFile(seedExpenses);

    const response = await request(app).get("/expenses/total");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      category: "All",
      total: 850,
    });
  });

  test("GET /expenses/total?category=Food returns the filtered total", async () => {
    const seedExpenses = [
      { id: "e1", title: "Lunch", amount: 250, category: "Food", date: "2026-07-31" },
      { id: "e2", title: "Taxi", amount: 500, category: "Travel", date: "2026-07-30" },
      { id: "e3", title: "Snacks", amount: 100, category: "food", date: "2026-07-29" },
    ];

    await writeExpensesFile(seedExpenses);

    const response = await request(app).get("/expenses/total?category=Food");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      category: "Food",
      total: 350,
    });
  });

  test("DELETE /expenses/:id removes an expense and returns 404 if deleted again", async () => {
    const createResponse = await request(app).post("/expenses").send({
      title: "Coffee",
      amount: 50,
      category: "Food",
      date: "2026-07-31",
    });

    expect(createResponse.status).toBe(201);

    const expenseId = createResponse.body.data.id;
    const deleteResponse = await request(app).delete(`/expenses/${expenseId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      success: true,
      message: "Expense deleted successfully.",
    });

    const storedExpenses = await readExpensesFile();
    expect(storedExpenses).toHaveLength(0);

    const deleteAgainResponse = await request(app).delete(`/expenses/${expenseId}`);

    expect(deleteAgainResponse.status).toBe(404);
    expect(deleteAgainResponse.body).toEqual({
      success: false,
      message: "Expense not found.",
    });
  });
});
