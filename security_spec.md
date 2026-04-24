# Security Specification for SEO Score

## 1. Data Invariants
- A user profile must match the authenticated user's ID.
- Users cannot modify their own email to something that doesn't match their auth email (if we enforce matches).
- Analysis history entries must belong to the user who created them.
- Timestamps must be server-generated.

## 2. The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Creating a user profile for a different UID.
2. **Ghost Fields**: Adding `isAdmin: true` to a user profile.
3. **History Hijacking**: Reading another user's analysis history.
4. **Timestamp Forgery**: Sending a manual `updatedAt` instead of `request.time`.
5. **ID Poisoning**: Using a 2MB string as a document ID.
6. **Email Spoofing**: Changing email in Firestore to an unverified admin email.
7. **Malformed Goals**: Sending an array of 5000 goals.
8. **Orphaned History**: Creating history for a user that doesn't exist.
9. **Update Gaps**: Updating `userId` in a history record.
10. **State Shortcutting**: (Not applicable yet, no status flow).
11. **Denial of Wallet**: Triggering deep `get()` calls in a list query.
12. **PII Leak**: Accessing `/users` collection with a blanket `isSignedIn()` read.

## 3. Test Runner (Draft)
```typescript
// firestore.rules.test.ts
// Tests would go here to verify PERMISSION_DENIED for above scenarios.
```
