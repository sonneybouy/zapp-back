# Inventory Management System Backend

This is the backend for the Inventory Management System, built with Node.js, Express, GraphQL, and Prisma.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Setup

1. Install dependencies: `npm install`
2. Set up the database:
- Make sure you have SQLite installed on your system.
- Create a `.env` file in the root of the backend directory with the following content:
  ```
  DATABASE_URL="file:./dev.db"
  ```

3. Run database migrations: `npx prisma migrate dev`
4. Generate Prisma client: `npx prisma generate`
## Running the Server

To start the server in development mode: `npm run dev`

The server will start on `http://localhost:4000` by default.

## API Documentation

The GraphQL playground is available at `http://localhost:4000/graphql` when running in development mode. You can use this to explore the API and run queries/mutations.

## CSV Upload

The server includes an endpoint for CSV upload at `POST /upload-csv`. Use this to bulk import inventory data.

## Additional Notes

- Make sure to keep your `.env` file secure and do not commit it to version control.
- For production deployment, consider using a more robust database system like PostgreSQL.

