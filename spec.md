# HUHS SSC Batch 2023

## Current State
The backend uses `let` (non-stable) Map variables — all data is wiped on every redeploy. The `resetAndClaimAdmin` function exists in Motoko but the reset loop modifies the map while iterating, which can fail. The frontend has hardcoded `SAMPLE_*` arrays used as `placeholderData` in every query, causing a flicker where demo data appears before real data loads.

## Requested Changes (Diff)

### Add
- `stable var` arrays for each data collection (posts, comments, categories, friends, galleryEvents, youtubeVideos, pdfDocuments, postLikes)
- `system func preupgrade()` to serialize Maps → stable arrays before upgrade
- `system func postupgrade()` to restore Maps from stable arrays after upgrade

### Modify
- `var visitorCount` → `stable var visitorCount`
- `var socialLinks` → `stable var socialLinks`
- `resetAndClaimAdmin`: fix map-while-iterating pattern by collecting keys first
- All `useQuery` hooks in `useQueries.ts`: remove `placeholderData: SAMPLE_*` and remove fallback returns of SAMPLE data when actor is nil; return empty arrays / null instead so loading spinners show
- `useGetPostBySlug`: remove SAMPLE fallback

### Remove
- All `SAMPLE_POSTS`, `SAMPLE_FRIENDS`, `SAMPLE_GALLERY`, `SAMPLE_VIDEOS`, `SAMPLE_PDFS`, `SAMPLE_CATEGORIES` exports and their use as fallback / placeholder data

## Implementation Plan
1. Update `src/backend/main.mo`: stable vars, preupgrade/postupgrade, fix resetAndClaimAdmin iteration
2. Update `src/frontend/src/hooks/useQueries.ts`: strip all SAMPLE data and placeholder fallbacks, queries return [] / null when actor unavailable
