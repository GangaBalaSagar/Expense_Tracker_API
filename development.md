# Smart Expense Tracker API - Implementation Roadmap

## Objective

Build a production-quality REST API for managing personal expenses.

The implementation **must be incremental**. Never skip ahead.

At the beginning of every phase:

1. Read this roadmap completely.
2. Inspect the existing project.
3. Verify all previously completed phases still work.
4. Only then implement the current phase.
5. Do not modify working functionality unless required to fix a bug.
6. Maintain backward compatibility with previous phases.

---

# Development Rules

## General Rules

* Follow REST API best practices.
* Keep code modular.
* Never duplicate logic.
* Keep controllers thin.
* Move business logic into services.
* Validate every input.
* Return proper HTTP status codes.
* Use async/await consistently.
* Keep functions small.
* Write clean, readable code.

---

## Project Structure

```
expense-tracker-api/

README.md
AI_NOTES.md
package.json
expenses.json

src/
    app.js
    server.js

    routes/
        expenseRoutes.js

    controllers/
        expenseController.js

    services/
        expenseService.js

    middleware/
        errorHandler.js
        validateExpense.js

    utils/
        fileHandler.js

tests/
    expense.test.js
```

Do not create unnecessary folders.

---

# Phase 1 - Project Initialization

## Goal

Create the project foundation.

### Tasks

* Initialize Node project
* Install dependencies
* Create folder structure
* Configure Express
* Create app.js
* Create server.js
* Add scripts to package.json
* Create empty expenses.json

### Verify

* Server starts successfully.
* GET / returns:

```
{
  "message": "Expense Tracker API Running"
}
```

Do not continue until this works.

---

# Phase 2 - File Storage Layer

## Goal

Implement JSON file persistence.

### Tasks

Create utility functions:

* readExpenses()
* writeExpenses()

Responsibilities:

* Read JSON file safely
* Handle empty file
* Handle missing file
* Return empty array if needed

### Verify

* Reading works.
* Writing works.
* Existing data remains intact.

No API endpoints yet.

---

# Phase 3 - Expense Model Validation

## Expense Schema

```
id
title
amount
category
date
```

Validation rules

title

* required
* string
* not empty

amount

* required
* number
* greater than zero

category

* required
* string

date

* valid ISO date

Return

400 Bad Request

for invalid input.

### Verify

Invalid payloads fail correctly.

---

# Phase 4 - Add Expense Endpoint

Implement

```
POST /expenses
```

Requirements

* Validate input
* Generate UUID
* Save expense
* Return created object

Status

```
201 Created
```

### Verify

Create multiple expenses.

Restart server.

Data must remain.

---

# Phase 5 - Get All Expenses

Implement

```
GET /expenses
```

Requirements

Return every expense.

### Verify

Returned data matches stored JSON exactly.

---

# Phase 6 - Filter by Category

Implement

```
GET /expenses?category=Food
```

Requirements

Return only matching expenses.

Case insensitive comparison.

### Verify

Unknown category returns empty array.

Existing endpoint still works.

---

# Phase 7 - Calculate Totals

Implement

```
GET /expenses/total
```

Returns

```
{
    "total": 3500
}
```

Implement

```
GET /expenses/total?category=Food
```

Returns

```
{
    "category":"Food",
    "total":1200
}
```

### Verify

Manual calculations equal API output.

---

# Phase 8 - Delete Expense

Implement

```
DELETE /expenses/:id
```

Requirements

Delete by ID.

If deleted

```
204 No Content
```

If not found

```
404 Not Found
```

### Verify

Deleted expense disappears permanently.

---

# Phase 9 - Global Error Handling

Create centralized middleware.

Responsibilities

* Invalid JSON
* Unexpected exceptions
* File errors

Responses must always be JSON.

Never expose stack traces.

### Verify

API never crashes.

---

# Phase 10 - Testing

Install

* Jest
* Supertest

Write tests for

* Add expense
* Invalid expense
* Get expenses
* Filter category
* Total
* Category total
* Delete
* Delete invalid ID

Minimum target

8-12 passing tests.

### Verify

```
npm test
```

passes completely.

---

# Phase 11 - Swagger Documentation (Bonus)

Install Swagger.

Expose

```
GET /docs
```

Document

* POST
* GET
* DELETE
* Parameters
* Responses

### Verify

Every endpoint is visible.

---

# Phase 12 - README

Include

* Project overview
* Installation
* Dependencies
* Run server
* Run tests
* Folder structure
* API endpoints
* Example requests
* Design decisions

Test every command exactly as written.

---

# Phase 13 - AI_NOTES

Document

## AI-generated

Explain which parts were AI-assisted.

## Human validation

Explain what was reviewed.

## Improvements

Explain changes made.

## Suggestions rejected

Explain why.

Do not write generic statements.

---

# Final Verification Checklist

Before completion verify:

* Project builds successfully.
* Server starts without errors.
* expenses.json persists data.
* All endpoints function.
* Validation works.
* Error handling works.
* Tests pass.
* Swagger works.
* README commands are correct.
* AI_NOTES is complete.
* No unused files.
* No console errors.
* No duplicated code.
* Folder structure matches assignment exactly.

---

# Implementation Policy

For every phase:

1. Read previous implementation.
2. Verify previous phases still pass.
3. Implement only the current phase.
4. Refactor only when necessary.
5. Do not break existing APIs.
6. Preserve compatibility with earlier features.
7. Run verification before proceeding.
8. If verification fails, fix it before continuing.
9. Never implement multiple future phases together unless explicitly instructed.
