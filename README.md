# Smart Expense Tracker API

## Project Overview

Smart Expense Tracker API is a Node.js and Express.js REST API for managing personal expenses. It solves a simple but common problem: recording expenses, reviewing them by category, calculating totals, and deleting entries without needing a database.

This repository was built as an incremental take-home assignment with a focus on clear API design, input validation, JSON file persistence, testing, and documentation.

## Features

- Add Expense
- List Expenses
- Filter by Category
- Calculate Total Expenses
- Delete Expense
- Input Validation
- JSON File Persistence
- Swagger API Documentation

## Tech Stack

- Node.js
- Express.js
- Custom validation middleware
- UUID generation via `crypto.randomUUID()`
- Swagger / OpenAPI
- Jest
- Supertest

## Project Structure

| Folder | Responsibility |
| --- | --- |
| `src/` | Application source code. |
| `src/controllers/` | HTTP request handlers and business flow. |
| `src/routes/` | API route definitions. |
| `src/middleware/` | Request validation and error handling. |
| `src/utils/` | Shared utility functions such as file storage helpers. |
| `tests/` | Jest and Supertest integration tests. |
| `docs/` | Swagger/OpenAPI documentation config. |

## Installation

```bash
git clone <repository-url>
cd expense-tracker-api
npm install
npm start
```

The server starts on `http://localhost:3000` by default.

## Running Tests

```bash
npm test
```

## API Documentation

Swagger UI is available at:

```text
http://localhost:3000/docs
Alias: http://localhost:3000/api-docs
```

## API Examples

### POST /expenses

Request:

```http
POST /expenses
Content-Type: application/json
```

```json
{
  "title": "Lunch",
  "amount": 250,
  "category": "Food",
  "date": "2026-07-31"
}
```

Response:

```json
{
  "success": true,
  "message": "Expense added successfully.",
  "data": {
    "id": "d5c84b7c-0f5b-4bbd-9d24-7ab1d1d2b1a1",
    "title": "Lunch",
    "amount": 250,
    "category": "Food",
    "date": "2026-07-31"
  }
}
```

### GET /expenses

Response:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "e1",
      "title": "Lunch",
      "amount": 250,
      "category": "Food",
      "date": "2026-07-31"
    },
    {
      "id": "e2",
      "title": "Taxi",
      "amount": 500,
      "category": "Travel",
      "date": "2026-07-30"
    }
  ]
}
```

### GET /expenses?category=Food

Response:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "e1",
      "title": "Lunch",
      "amount": 250,
      "category": "Food",
      "date": "2026-07-31"
    }
  ]
}
```

### GET /expenses/total

Response:

```json
{
  "success": true,
  "category": "All",
  "total": 750
}
```

### DELETE /expenses/:id

Request:

```http
DELETE /expenses/d5c84b7c-0f5b-4bbd-9d24-7ab1d1d2b1a1
```

Response:

```text
204 No Content
```

## Design Decisions

- Express.js was chosen because it is lightweight, familiar, and well-suited to a small REST API.
- JSON file storage was used because the assignment allowed it and it keeps the project simple to run locally.
- Validation middleware was added to keep request checks out of the controller and ensure consistent input handling.
- UUID-style ids are generated with `crypto.randomUUID()` so each expense has a unique identifier.
- Swagger was included so the API can be explored and verified quickly in a browser.

## Error Handling

- Validation errors return `400 Bad Request` with a JSON response that explains what failed.
- Server-side and storage errors are handled by centralized middleware so responses stay consistent and JSON-formatted.
- The API avoids exposing stack traces in normal responses.

## Testing

The test suite uses:

- Jest for test execution
- Supertest for real HTTP requests against the Express app

Coverage includes:

- happy-path endpoint tests
- validation failures
- file storage edge cases
- malformed request bodies
- delete behavior
- total calculations

## Future Improvements

- Database persistence
- Authentication
- Pagination
- Search
