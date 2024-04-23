# Balances validations

## What is it ?
This project is a simple NestJS API to validate banking movements against checkpoints.

You can also check the Angular front in this repos : https://github.com/AdrienMS/balances-validations-front

## Description
The app have 2 endpoints :

### Swagger
Access to the Swagger documentation
```
GET /api/doc
```

### Balances validation
```
POST /api/movements/validation
```
You can check how using it with the documentation.

### Logic
The object send in body is :
```json
{
    "movements": [
        {
            "id" : "id",
            "date": "2024-04-01T00:00:00.000Z",
            "wording": "wording",
            "amount": 42
        },
        ...
    ],
    "balances": [
        {
            "date": "date": "2024-04-01T00:00:00.000Z",
            "balance": 42
        },
        ...
    ]
}
```
To validate balances, there are several steps :
- First we check via DTOs if the send object is correctly formed :
    - There are, at least, 2 balance objects
    - Via DTOs, if movement and balance objects contain the correct properties and they are not empty
- Sort balances by date to :
    - extract date range
    - calculate differences between balances
- Check if there are duplicates movements
- Check if movements are in the extract date range
- Retrieve movements that fall within each specified date range
- And calculate balance

#### Errors thrown
If there are errors, the response object is always returned with a 418 status and formatted like :
```json
{
  "message": "I'm a teapot",
  "reasons": []
}
```
There are 7 reasons to throw errors :
- Incorrect parameter
- Two movements are identical
- Two movements contain the same identifier,
- Movements out of range
- Missing movements
- Excess movements
- Unknow Error
## Tech Stack

- Nest 10.0.0
- Jest
- Swagger


## Installation and Run

Install and run the project with npm

```bash
  # installation
  npm i

  # run
  npm run start:dev
```
    
## Running Tests

To run tests, run the following command

```bash
  npm run test

  # with coverage
  npm run test:cov
```

Code coverage : 100%
