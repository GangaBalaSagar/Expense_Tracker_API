# AI Usage Notes

## 1. Overview

AI tools, including ChatGPT/Codex, were used as development assistants during implementation. All generated code and documentation were reviewed before being accepted into the project.

## 2. AI-Assisted Tasks

AI assistance was used to draft and organize the work across the main phases of the project:

- project planning from `development.md`
- Express application setup
- folder and file structure
- middleware implementation
- controller logic
- route wiring
- input validation
- JSON file storage utilities
- centralized error handling
- Jest and Supertest test cases
- Swagger/OpenAPI documentation
- README drafting

## 3. Human Contributions

The final implementation was manually reviewed and validated. Human work included:

- reviewing generated code before it was accepted
- checking that API behavior matched the assignment requirements
- debugging issues during implementation
- running the test suite
- verifying endpoint behavior with manual requests
- checking persistence in `expenses.json`
- reviewing Swagger output in the browser
- deciding when the implementation was complete for each phase

## 4. Validation and Changes

AI-generated output was validated through a combination of automated and manual checks:

- manual endpoint testing for `GET`, `POST`, and `DELETE` flows
- verification of JSON response shapes and HTTP status codes
- testing validation failures and multiple-field validation errors
- checking that expense data persisted to `expenses.json`
- verifying delete behavior and not-found responses
- reviewing Swagger documentation output
- running `npm test` to confirm the Jest/Supertest suite passed

## 5. AI Suggestions Not Used

Some AI suggestions were intentionally not implemented:

- a separate service layer was not added because it was unnecessary for the scope of this assignment
- a database migration was not introduced because JSON file storage was explicitly allowed
- extra architectural complexity was avoided to keep the project aligned with the incremental roadmap

## 6. Final Statement

AI accelerated development, but all code, documentation, and API behavior were manually reviewed, tested, and verified before submission.
