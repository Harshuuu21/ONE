# ONE Financial OS - Event Catalog

## Core Principles
All domain events are published to the Google Cloud Eventarc bus under the topic `one-events`.
Every event is processed idempotently by subscribers wrapped in `createIdempotentProcessor`, ensuring exactly-once execution despite Eventarc's at-least-once delivery guarantees.

## Financial Events
| Event Name | Publisher | Subscribers | Description |
| :--- | :--- | :--- | :--- |
| `one.financial.transaction_processed` | `transactionEvents.ts` | `transactionProcessor.ts` | Triggered when a raw transaction is finalized. Drives Financial Intelligence generation. |

## Identity Events
| Event Name | Publisher | Subscribers | Description |
| :--- | :--- | :--- | :--- |
| `one.identity.user_registered` | `registrationService.ts` | None | Triggered on account creation. |

## Community & Reputation Events
| Event Name | Publisher | Subscribers | Description |
| :--- | :--- | :--- | :--- |
| `one.community.post_created` | `communityService.ts` | `communityProcessor.ts`, `aiCircuitBreaker.ts` | Triggers reputation bumps and async AI community mentor processing. |
| `one.community.helpful_reply` | `communityService.ts` | `communityProcessor.ts` | Increases knowledge and collaboration trust dimensions. |

## Lending Events
| Event Name | Publisher | Subscribers | Description |
| :--- | :--- | :--- | :--- |
| `one.lending.request_created` | `requestEngine.ts` | None | Emitted when a borrower requests a loan. |
| `one.lending.loan_active` | `lifecycleEngine.ts` | `notificationProcessor.ts`, `aiCircuitBreaker.ts` | Triggers urgent notifications and AI explanation generation. |
| `one.lending.repayment_made` | `repaymentEngine.ts` | `communityProcessor.ts` | Triggers a reliability reputation boost. |
| `one.lending.penalty_applied` | `penaltyEngine.ts` | `communityProcessor.ts`, `notificationProcessor.ts` | Triggers strict reputation downgrades and urgent alerts. |
| `one.lending.loan_defaulted` | `lifecycleEngine.ts` | `communityProcessor.ts` | Triggers massive reputation downgrades. |

## Goal & Travel Events
| Event Name | Publisher | Subscribers | Description |
| :--- | :--- | :--- | :--- |
| `one.goals.goal_achieved` | `goalService.ts` | `communityProcessor.ts`, `notificationProcessor.ts` | Triggers reputation reliability boost and standard notifications. |
| `one.travel.trip_created` | `travelService.ts` | None | Emitted when a trip clears affordability planning. |
