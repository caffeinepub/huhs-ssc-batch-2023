# HUHS SSC Batch 2023

## Current State
Full-stack app with Motoko backend and React frontend. Admin panel at `/admin` with claim/reset flow. Backend uses stable variables. All CRUD features implemented.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `access-control.mo`: `getUserRole` now returns `#guest` instead of trapping for unregistered users
- `access-control.mo`: `isAdmin` now uses direct switch on userRoles map (never traps)
- `access-control.mo`: Added `getUserRoleStrict` for places that need the old trap behavior
- `hasPermission` now returns false (instead of trapping) for unregistered users trying to access user/admin resources

### Remove
- Nothing removed

## Implementation Plan
1. Fix `access-control.mo` so `isCallerAdmin()` and `isAdmin()` never trap for unknown principals -- return false instead
2. Keep strict checking available via `getUserRoleStrict` for explicit error paths
3. Deploy
