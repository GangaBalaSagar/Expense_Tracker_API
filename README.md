# Smart Expense Tracker API

## Overview

Smart Expense Tracker API is a RESTful expense management service built with Express.js. It stores data in a local JSON file, making it simple to run without a database while still supporting full expense tracking workflows.

## Features

- Add expense
- List expenses
- Category filtering
- Total calculations
- Delete expense
- Validation
- Global error handling
- Swagger documentation
- Automated tests

## Tech Stack

- Node.js
- Express
- Jest
- Supertest
- Swagger UI
- swagger-jsdoc

## Installation

```bash
npm install
```

## Run

Start the server:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## API Endpoints

| Method | Endpoint | Description | Status Codes |
| --- | --- | --- | --- |
| `GET` | `/` | Health check that returns the API running message. | `200`, `500` |
| `POST` | `/expenses` | Creates a new expense after validation. | `201`, `400`, `500` |
| `GET` | `/expenses` | Returns all stored expenses. | `200`, `500` |
| `GET` | `/expenses?category=` | Returns expenses filtered by category, case-insensitive. | `200`, `500` |
| `GET` | `/expenses/total` | Returns the total for all expenses. | `200`, `500` |
| `GET` | `/expenses/total?category=` | Returns the total for a specific category. | `200`, `500` |
| `DELETE` | `/expenses/:id` | Deletes an expense by ID. | `200`, `404`, `500` |

## Swagger

Interactive API documentation is available at:

```text
http://localhost:3000/api-docs
```

## Project Structure

```text
expense-tracker-api/
|-- README.md
|-- package.json
|-- package-lock.json
|-- expenses.json
|-- docs/
|   `-- swagger.js
|-- src/
|   |-- app.js
|   |-- server.js
|   |-- controllers/
|   |   `-- expenseController.js
|   |-- middleware/
|   |   |-- errorHandler.js
|   |   `-- validateExpense.js
|   |-- routes/
|   |   `-- expenseRoutes.js
|   `-- utils/
|       `-- fileHandler.js
`-- tests/
    `-- app.test.js
```

## Future Improvements

- Database support
- Authentication
- Pagination
- Docker
