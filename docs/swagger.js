const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Expense Tracker API",
    version: "1.0.0",
    description: "OpenAPI documentation for the Smart Expense Tracker API.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "API status endpoints",
    },
    {
      name: "Expenses",
      description: "Expense management endpoints",
    },
  ],
  components: {
    schemas: {
      RootResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Expense Tracker API Running",
          },
        },
      },
      ValidationErrorItem: {
        type: "object",
        properties: {
          field: {
            type: "string",
            example: "amount",
          },
          message: {
            type: "string",
            example: "Amount must be greater than zero.",
          },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Validation failed",
          },
          errors: {
            type: "array",
            items: {
              $ref: "#/components/schemas/ValidationErrorItem",
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Internal Server Error",
          },
          error: {
            type: "string",
            example: "ENOENT: no such file or directory",
          },
        },
      },
      ExpenseInput: {
        type: "object",
        required: ["title", "amount", "category", "date"],
        properties: {
          title: {
            type: "string",
            example: "Lunch",
          },
          amount: {
            type: "number",
            format: "float",
            example: 250,
          },
          category: {
            type: "string",
            example: "Food",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2026-07-31",
          },
        },
      },
      Expense: {
        allOf: [
          {
            $ref: "#/components/schemas/ExpenseInput",
          },
          {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "d5c84b7c-0f5b-4bbd-9d24-7ab1d1d2b1a1",
              },
            },
          },
        ],
      },
      ExpenseListResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          count: {
            type: "integer",
            example: 2,
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Expense",
            },
          },
        },
      },
      TotalResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          category: {
            type: "string",
            example: "Food",
          },
          total: {
            type: "number",
            example: 350,
          },
        },
      },
      DeleteExpenseResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Expense deleted successfully.",
          },
        },
      },
      NotFoundResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Expense not found.",
          },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [__filename],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check API status
 *     description: Returns a confirmation message that the API is running.
 *     responses:
 *       200:
 *         description: API is running.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RootResponse'
 *             examples:
 *               success:
 *                 value:
 *                   message: Expense Tracker API Running
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   message: Internal Server Error
 */
/**
 * @openapi
 * /expenses:
 *   post:
 *     tags:
 *       - Expenses
 *     summary: Create an expense
 *     description: Validates and stores a new expense record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseInput'
 *           examples:
 *             lunch:
 *               summary: Valid expense payload
 *               value:
 *                 title: Lunch
 *                 amount: 250
 *                 category: Food
 *                 date: '2026-07-31'
 *     responses:
 *       201:
 *         description: Expense created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Expense added successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Expense'
 *             examples:
 *               created:
 *                 value:
 *                   success: true
 *                   message: Expense added successfully.
 *                   data:
 *                     id: d5c84b7c-0f5b-4bbd-9d24-7ab1d1d2b1a1
 *                     title: Lunch
 *                     amount: 250
 *                     category: Food
 *                     date: '2026-07-31'
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               invalidAmount:
 *                 value:
 *                   success: false
 *                   message: Validation failed
 *                   errors:
 *                     - field: amount
 *                       message: Amount must be greater than zero.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   message: Internal Server Error
 *   get:
 *     tags:
 *       - Expenses
 *     summary: Get expenses
 *     description: Returns all expenses or filters them by category when the query parameter is provided.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional category filter. Matching is case-insensitive.
 *         example: Food
 *     responses:
 *       200:
 *         description: Expenses returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseListResponse'
 *             examples:
 *               allExpenses:
 *                 value:
 *                   success: true
 *                   count: 2
 *                   data:
 *                     - id: e1
 *                       title: Lunch
 *                       amount: 250
 *                       category: Food
 *                       date: '2026-07-31'
 *                     - id: e2
 *                       title: Taxi
 *                       amount: 500
 *                       category: Travel
 *                       date: '2026-07-30'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   message: Internal Server Error
 */
/**
 * @openapi
 * /expenses/total:
 *   get:
 *     tags:
 *       - Expenses
 *     summary: Get expense totals
 *     description: Returns the total for all expenses or the total for a filtered category when the query parameter is present.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional category filter for the total calculation.
 *         example: Food
 *     responses:
 *       200:
 *         description: Total calculated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TotalResponse'
 *             examples:
 *               allTotals:
 *                 value:
 *                   success: true
 *                   category: All
 *                   total: 850
 *               categoryTotal:
 *                 value:
 *                   success: true
 *                   category: Food
 *                   total: 350
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   message: Internal Server Error
 */
/**
 * @openapi
 * /expenses/{id}:
 *   delete:
 *     tags:
 *       - Expenses
 *     summary: Delete an expense
 *     description: Deletes an expense by its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense id to delete.
 *         example: d5c84b7c-0f5b-4bbd-9d24-7ab1d1d2b1a1
 *     responses:
 *       200:
 *         description: Expense deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteExpenseResponse'
 *             examples:
 *               deleted:
 *                 value:
 *                   success: true
 *                   message: Expense deleted successfully.
 *       404:
 *         description: Expense not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             examples:
 *               missing:
 *                 value:
 *                   success: false
 *                   message: Expense not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   message: Internal Server Error
 */

module.exports = swaggerSpec;
