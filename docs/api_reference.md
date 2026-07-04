# Backend API Reference

## Identity Endpoints (`/api/identityApi`)
- `registerUser(payload)`: Orchestrates user creation, defaults, and fires `user_registered`.

## Financial Endpoints (`/api/financialApi`)
- `addTransaction(payload)`: Appends an immutable ledger entry and fires `transaction_processed`.

## Goals Endpoints (`/api/goalApi`)
- `createGoal(payload)`: Validates affordability via Planning Engine before saving.
- `addGoalContribution(payload)`: Adds funds and potentially fires `goal_achieved`.

## Travel Endpoints (`/api/travelApi`)
- `createTrip(payload)`: Validates trip cost against Financial Intelligence.

## Community Endpoints (`/api/communityApi`)
- `createCommunityPost(payload)`: Adds feed post and calculates deterministic decay ranking.

## Lending Endpoints (`/api/lendingApi`)
- `requestLoan(payload)`: Validates risk, fraud, and credit limit. Takes immutable snapshots.
- `makeRepayment(payload)`: Processes payment and fires `repayment_made` (boosting Trust).

## Health Endpoints (`/api/healthApi`)
- `GET /health`: Returns `{ status: "UP", platformVersion: "1.0.0-rc1", dependencies: {...} }`
