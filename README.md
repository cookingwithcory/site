# Cooking With Cory

Recipe site with Instagram video players. Next.js on Vercel, Supabase for data, logins and photos.

## Setup

1. Create a Supabase project. Run `supabase/schema.sql` in its SQL editor.
2. In Supabase, open Authentication, then Sign In / Providers, and turn off "Allow new users to sign up".
   The database lets every signed-in user edit recipes, so this step is required.
3. In Authentication, then Users, add one user each for Cory and for you. Sign in uses an emailed link, so no password is needed.
4. Copy `.env.example` to `.env.local` and fill in the two values from the project's API settings.
5. In Authentication, then URL Configuration, add the site address plus `/admin` to Redirect URLs (local and deployed).
6. `npm run dev`, then open http://localhost:3000.

## Deploy

1. Push this folder to GitHub and import it in Vercel.
2. Add the two variables from `.env.example` in the Vercel project settings.
3. `vercel.json` schedules a daily call to `/api/keepalive`, which stops the free Supabase project from pausing.

## Using it

- "Sign in" is in the page footer. After sign in, "Add recipe" shows in the header and "Edit" shows on each recipe.
- Ingredients and directions take one item per line.
- The Instagram link is the post or reel URL from Instagram's Share menu. The post must be public.

## Test

`npm test` checks the Instagram link parser.
