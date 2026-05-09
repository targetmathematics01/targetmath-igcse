# TargetMath IGCSE

Next.js + Supabase + Vercel video course starter.

## Features
- Landing page with register/login popup
- Forgot password/reset password
- Supabase Auth
- Admin panel
- Chapters and videos
- Sample videos and paid-only videos
- Payment screenshot upload
- Admin approve/reject activation
- One account one active device
- YouTube unlisted embed

## Setup
1. Create Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Create Supabase Storage bucket: `payment-screenshots` and make it public for simple preview.
4. Register first user.
5. In SQL Editor, set admin email:
   `update profiles set role = 'admin', status = 'active', plan = 'premium' where email = 'your-email@example.com';`
6. Copy `.env.example` to `.env.local` and fill Supabase values.
7. Run `npm install` then `npm run dev`.
8. Deploy to Vercel and add environment variables.

## Environment variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_SITE_URL
