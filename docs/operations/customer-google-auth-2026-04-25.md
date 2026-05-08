# Customer Google Auth

Status: implemented-code, google-live-configured, apple-held
Date: 2026-04-25
Surface: customer-app
Domains: auth, social-login, supabase

## What Changed

The customer app now exposes Google sign-in alongside Zalo and Kakao. Zalo keeps the dedicated Zalo exchange flow. Kakao and Google use the existing Supabase OAuth path.

Apple sign-in was implemented at the code-path level during exploration, but it is intentionally not exposed in the customer UI and is not part of the approved live provider set because Apple Developer enrollment is a paid external dependency.

Local Supabase config still contains provider blocks in `supabase/config.toml`, but the runtime provider patch script now enables Google and explicitly disables Apple.

The Supabase provider patch script reads credentials from the local shell environment, the repo root `.env.local`, and `customer-app/.env.local`. It does not read macOS Keychain values.

## Runtime Configuration

To enable the approved provider set in Supabase, add these values to the repo root `.env.local` and run:

```bash
node scripts/configure-supabase-social-auth.mjs
```

Required values:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID`
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET`

Current project values were updated locally on 2026-04-25 for project ref `gjcwxsezrovxcrpdnazc`.

## External Provider Requirements

Google requires a Google OAuth web client with the Supabase callback URL registered. For local development that callback is `http://127.0.0.1:54321/auth/v1/callback`; for production it is `https://gjcwxsezrovxcrpdnazc.supabase.co/auth/v1/callback`.

Apple remains intentionally disabled. Re-enabling Apple requires an Apple Developer account, Services ID, Team ID, Key ID, and generated Apple client secret, plus a product decision to accept that paid dependency.

## Current Verification

- `customer-app` UI now shows `Zalo`, `Google`, and `Kakao` only.
- `flutter analyze` and `flutter test` passed on the customer auth changes.
- A Deliberry-dedicated Google OAuth web client was created on 2026-04-25 and connected to the Supabase Google provider.
- The provider patch script now aligns with the approved runtime state by enabling Google and disabling Apple.
