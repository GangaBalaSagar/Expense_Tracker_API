const path = require("path");
const fs = require("fs").promises;
const request = require("supertest");
const app = require("../src/app");

const expensesFilePath = path.join(__dirname, "..", "expenses.json");

const sampleExpenses = [
  { id: "e1", title: "Lunch", amount: 250, category: "Food", date: "2026-07-31" },
  { id: "e2", title: "Taxi", amount: 500, category: "Travel", date: "2026-07-30" },
  { id: "e3", title: "Snacks", amount: 100, category: "food", date: "2026-07-29" },
];

const validExpensePayload = {
  title: "Lunch",
  amount: 250,
  category: "Food",
  date: "2026-07-31",
};

const invalidExpensePayload = {
  title: " ",
  amount: 0,
  category: "",
  date: "bad-date",
};

const malformedJsonBody = "{ bad json";
const malformedJsonStorage = "{ bad json";
const invalidStorageObjects = [
  ["object", "{}"],
  ["number", "123"],
];

async function readExpensesFile() {
  const fileContents = await fs.readFile(expensesFilePath, "utf8");
  return fileContents.trim() ? JSON.parse(fileContents) : [];
}

async function writeExpensesFile(expenses) {
  await fs.writeFile(expensesFilePath, JSON.stringify(expenses, null, 2), "utf8");
}

async function writeRawExpensesFile(contents) {
  await fs.writeFile(expensesFilePath, contents, "utf8");
}

async function restoreOriginalExpenses(originalExpenses) {
  await fs.writeFile(expensesFilePath, originalExpenses, "utf8");
}

describe("Expense Tracker API", () => {
  let originalExpenses;

  beforeAll(async () => {
    originalExpenses = await fs.readFile(expensesFilePath, "utf8");
  });

  beforeEach(async () => {
    await writeExpensesFile([]);
  });

  afterEach(async () => {
    await restoreOriginalExpenses(originalExpenses);
  });

  afterAll(async () => {
    await restoreOriginalExpenses(originalExpenses);
  });

  describe("GET /", () => {
    test("returns the API running message", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Expense Tracker API Running" });
    });
  });

  describe("POST /expenses", () => {
    test("creates a valid expense and writes it to disk", async () => {
      const response = await request(app).post("/expenses").send(validExpensePayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toMatchObject(validExpensePayload);

      const storedExpenses = await readExpensesFile();
      expect(storedExpenses).toHaveLength(1);
      expect(storedExpenses[0]).toMatchObject(validExpensePayload);
      expect(storedExpenses[0]).toHaveProperty("id", response.body.data.id);
    });

    test("rejects an invalid expense payload", async () => {
      const response = await request(app).post("/expenses").send(invalidExpensePayload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test("returns a JSON error response for malformed request bodies", async () => {
      const response = await request(app)
        .post("/expenses")
        .set("Content-Type", "application/json")
        .send(malformedJsonBody);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
          error: expect.any(String),
        })
      );
    });
  });

  describe("GET /expenses", () => {
    test("returns an empty list when expenses.json is empty", async () => {
      await writeRawExpensesFile("");

      const listResponse = await request(app).get("/expenses");
      const totalResponse = await request(app).get("/expenses/total");

      expect(listResponse.status).toBe(200);
      expect(listResponse.body).toEqual({
        success: true,
        count: 0,
        data: [],
      });

      expect(totalResponse.status).toBe(200);
      expect(totalResponse.body).toEqual({
        success: true,
        category: "All",
        total: 0,
      });
    });

    test("returns a server error when expenses.json contains malformed JSON", async () => {
      await writeRawExpensesFile(malformedJsonStorage);

      const response = await request(app).get("/expenses");

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: "Internal Server Error",
          error: expect.any(String),
        })
      );
    });

    test.each(invalidStorageObjects)(
      "returns a server error when expenses.json is valid JSON but not an array (%s)",
      async (_, contents) => {
        await writeRawExpensesFile(contents);

        const response = await request(app).get("/expenses");

        expect(response.status).toBe(500);
        expect(response.body).toEqual(
          expect.objectContaining({
            success: false,
            message: "Internal Server Error",
            error: expect.any(String),
          })
        );
      }
    );

    test("returns an empty response when expenses.json does not exist", async () => {
      const backupPath = `${expensesFilePath}.bak`;

      await fs.rename(expensesFilePath, backupPath);

      try {
        const response = await request(app).get("/expenses");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          success: true,
          count: 0,
          data: [],
        });
      } finally {
        await fs.rename(backupPath, expensesFilePath);
      }
    });

    test("returns all stored expenses", async () => {
      await writeExpensesFile(sampleExpenses.slice(0, 2));

      const response = await request(app).get("/expenses");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(response.body.data.length);
      expect(response.body.data).toEqual(sampleExpenses.slice(0, 2));
    });

    test("filters expenses case-insensitively by category", async () => {
      await writeExpensesFile(sampleExpenses);

      const response = await request(app).get("/expenses?category=Food");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toEqual([sampleExpenses[0], sampleExpenses[2]]);
    });
  });

  describe("GET /expenses/total", () => {
    test("returns the total for all expenses", async () => {
      await writeExpensesFile(sampleExpenses);

      const response = await request(app).get("/expenses/total");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        category: "All",
        total: 850,
      });
    });

    test("returns the filtered total for a category", async () => {
      await writeExpensesFile(sampleExpenses);

      const response = await request(app).get("/expenses/total?category=Food");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        category: "Food",
        total: 350,
      });
    });
  });

  describe("DELETE /expenses/:id", () => {
    test("removes an expense and returns 404 if deleted again", async () => {
      const createResponse = await request(app).post("/expenses").send(validExpensePayload);

      expect(createResponse.status).toBe(201);

      const expenseId = createResponse.body.data.id;
      const deleteResponse = await request(app).delete(`/expenses/${expenseId}`);

      expect(deleteResponse.status).toBe(204);
      expect(deleteResponse.text).toBe("");

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
});
