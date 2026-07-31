# AI Usage Notes

## Overview

AI tools were used as development assistants during this take-home assignment. All generated code, documentation, and recommendations were reviewed before being accepted into the project.

## AI-Assisted Work

AI helped with:

- architecture discussions during the incremental build
- Express app setup and folder organization
- route and controller implementation ideas
- validation middleware design
- JSON file storage helpers
- centralized error-handling suggestions
- Swagger/OpenAPI documentation structure
- Jest and Supertest test ideas
- README improvements

## Human Validation

Every AI suggestion was checked against the actual application behavior. Validation included:

- running the Jest suite
- testing endpoints with Supertest
- verifying request validation and error responses
- checking JSON file persistence
- reviewing Swagger output in the browser
- confirming that the API matched the assignment scope

## Rejected AI Suggestions

Some suggestions were intentionally not used:

- MongoDB: the assignment allowed JSON file storage, so a database was unnecessary
- Docker: not required for the scope of the take-home
- Service Layer: the project was small enough that adding one would have added complexity without meaningful value
- Repository Pattern: not needed for a simple JSON-backed assignment
- Authentication: not part of the requirements
- Logging Framework: useful in larger systems, but unnecessary overhead here
- Production architecture: rejected because the goal was a clear assignment implementation, not an overbuilt platform

## Final Statement

The final implementation reflects engineering decisions made after reviewing and validating AI suggestions. AI accelerated the work, but the code and documentation were shaped by manual review and scope-aware judgment.
