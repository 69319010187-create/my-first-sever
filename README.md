# my-first-sever

This repository contains a simple Node.js + Express application that manages a student list backed by PostgreSQL.

Features added:
- Express-based server
- REST API: GET/POST/PUT/DELETE under /api/students
- Input validation and escaping (max 100 characters)
- Static UI in /public (add, edit, delete)
- Migrations and seed SQL
- Docker Compose config (Postgres + app)
- CORS and request logging (morgan)

Quick start (using Docker Compose):

1. Start services:

   docker-compose up --build

2. Initialize database (in another terminal):

   # run migration
   docker-compose exec db psql -U postgres -d studentsdb -f /app/migrations/create_students.sql

   # seed sample data
   docker-compose exec db psql -U postgres -d studentsdb -f /app/migrations/seed_students.sql

3. Open http://localhost:3000

Running locally without Docker:

1. Ensure you have a Postgres database and set DATABASE_URL (see .env.example).
2. npm install
3. npm run migrate
4. npm run seed
5. npm start

If you want any changes (add fields, improve validation, pagination, tests), tell me and I'll update the code.
