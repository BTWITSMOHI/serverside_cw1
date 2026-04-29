# Alumni Management API
This is a backend API built using Node.js, Express, and PostgreSQL

## Setup Instructions

1. Install dependencies:
npm install

2. Create database:
Recomended GUI- pgAdmin
CREATE DATABASE serverside_cw1;

3. Run schema:
psql -U postgres -d serverside_cw1 -f schema.sql

4. Configure environment:
Rename .env.example to .env and fill in the values

5. Start server:
npm run dev

## API Documentation
http://localhost:5001/api-docs

## Notes

-Ensure PostgreSQL is running before starting the server