# HUHS SSC Batch 2023

## Current State
Admin access is controlled via `claimAdminRole` which blocks if `adminAssigned` is true. The admin was already claimed by a prior session, so the site owner is locked out.

## Requested Changes (Diff)

### Add
- `resetAndClaimAdmin(resetCode: Text)` backend function: if the provided code matches a hardcoded secret, it clears all existing admin assignments, resets `adminAssigned` to false, and immediately assigns the caller as the new admin.
- A "Reset Admin" section in AdminPage that appears when claim fails, asking for the reset code.

### Modify
- `AdminPage.tsx`: After a failed claim, show a secondary form with a reset code input and a "Reset & Claim Admin" button.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `resetAndClaimAdmin` to `main.mo` with hardcoded secret `HUHS-ADMIN-RESET-2023`.
2. Update `AdminPage.tsx` to show the reset form on failed claim.
3. Deploy.
