# Imaginal

Teaser landing page for the film *Imaginal*.

## Local development

1. Install dependencies with `npm install` or `pnpm install`.
2. Run `npm run dev`.

## Protected Strategy Room preview

The `/strategy-room` prototype and its `/strategy-room/*` assets require HTTP Basic authentication in deployed builds. Set the server-only `IMAGINAL_PREVIEW_PASSWORD` environment variable in the existing hosting project before deployment; the username is `imaginal`. No password value is committed. If the variable is missing, production preview requests return 503. The public homepage and `/watch` remain accessible. Local development stays unlocked when the variable is unset.

The production password gate was verified locally against anonymous requests, wrong usernames/passwords, authenticated page/assets, missing configuration, and the unaffected public routes. The preview deploys through the existing Imaginal Vercel project when changes are pushed to `main`; its password is configured for Production in Vercel.
