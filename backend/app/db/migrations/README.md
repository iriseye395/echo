Apply the SQL migration in this folder against PostgreSQL before deploying to production.

Example:
psql "$DATABASE_URL" -f app/db/migrations/001_init.sql
