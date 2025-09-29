Backend for KnowYou Survey App
Setup

Install dependencies: npm install
Create a .env file:SUPABASE_URL=https://njodostonkvbovcgrayz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA
JWT_SECRET=your-secure-jwt-secret-1234567890abcdef
PORT=5000


Ensure the table1 table exists in Supabase with RLS policies.
Run the server: node server.js

API Endpoints

POST /auth/signup: Register a user and send a magic link.
POST /auth/login: Send a magic link for login.
GET /auth/me: Get current user (requires JWT and confirmed email).

Notes

Users must confirm their email via magic link before logging in.
Survey results are stored in the survey_result column of table1.

