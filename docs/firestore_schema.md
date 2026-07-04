# Firestore Schema Reference

## Platform Infrastructure
- `system_locks/{resourceId}`: Transient distributed locks.
- `event_ledger/{eventId}`: Idempotency tracking (status: PROCESSING, SUCCESS, DLQ).
- `dlq_events/{eventId}`: Dead Letter Queue for failed event payloads.
- `platform_config/features`: Boolean feature flags.
- `platform_config/policies`: Versioned global business rules (lending rates, trust thresholds).
- `platform_config/health`: Transient heartbeat target.

## Identity & Core
- `users/{uid}`: Core auth state and verification.
- `user_profiles/{uid}`: Display data and onboarding status.
- `user_preferences/{uid}`: Configurable UX settings.
- `user_sessions/{sessionId}`: Active session tracking.

## Financial Engine
- `transactions/{txId}`: Raw immutable ledger.

## Financial Intelligence
- `financial_intelligence/{uid}`: Deterministic snapshot of features (cashflow) and signals (expenseTrend).

## Community & Reputation
- `communities/{communityId}`: Groups and challenges.
- `community_posts/{postId}`: Feed items.
- `reputation_profiles/{uid}`: Multi-dimensional trust scores.
- `reputation_history/{historyId}`: Immutable audit trail of every score mutation.

## Lending Engine
- `loan_requests/{requestId}`: Borrower application and immutable snapshot context.
- `loans/{loanId}`: Active, finalized smart-contract agreement.
- `loan_installments/{installmentId}`: Deterministic repayment schedule.
- `loan_repayments/{repaymentId}`: Immutable ledger of payments.

## Orchestration
- `notifications/{notificationId}`: Deduplicated, prioritized outbound messages.
