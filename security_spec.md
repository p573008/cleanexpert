# Security Specification - CLEANEXPERT

## Data Invariants
1. A booking must be associated with a valid authenticated user (userId).
2. Users can only read their own bookings.
3. Reviews are public for reading, but only writable by the author.
4. Services are read-only for public, writable only by admins.
5. Critical fields like `status` in bookings can only be updated by admins once it reaches `confirmed`.
6. Timestamps `createdAt` must match `request.time`.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Create booking with someone else's `userId`.
2. **State Shortcutting**: Create booking with `status: 'completed'`.
3. **Privilege Escalation**: Update user profile to `role: 'admin'`.
4. **Unauthorized Read**: List bookings without filtering by `userId`.
5. **Orphaned Write**: Create booking for a non-existent service (if enforced).
6. **Immutable Violation**: Change `createdAt` on update.
7. **Resource Poisoning**: Extremely long string in `address` or `contact`.
8. **Malicious Review**: Set rating to 999.
9. **Admin Spoofing**: Write to `services` collection as a standard user.
10. **Shadow Update**: Add `free: true` field to booking.
11. **PII Leak**: Read `/users/{otherUserId}` as a stranger.
12. **Future Injection**: Setting `createdAt` to a future date instead of server time.

## Evaluation Checklist
| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
| :--- | :--- | :--- | :--- |
| services | Protected | N/A | Size limited |
| bookings | userId check | status check | Size limited |
| reviews | userId check | N/A | Size limited |
| users | Self-profile only | role immutable | Size limited |
