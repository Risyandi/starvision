# Starvision Project

This repository contains both the backend (Go) and frontend (React) applications for the Starvision project.


---

## Prerequisites

- Node.js (v16 or higher) and npm or yarn
- Go (v1.18 or higher)
- MySQL (for backend database)

---

## Backend Setup (`backend/`)

1. **Navigate to the backend folder:**
    ```bash
    cd starvision/backend
    ```

2. **Copy and configure environment variables:**
    ```bash
    cp .env-example .env
    # Edit .env as needed for your database and server settings
    ```

3. **Install Go dependencies:**
    ```bash
    go mod tidy
    ```

4. **Set up the database:**
    - Import the schema from `docs/posts_db.sql` into your MySQL database.

5. **Run the backend server:**
    ```bash
    go run main.go
    ```
    - The server will start on the port specified in `.env` (default: 8080).

---

## Frontend Setup (`frontend/`)

1. **Navigate to the frontend folder:**
    ```bash
    cd starvision/frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure environment variables:**
    - Edit `.env` as needed (for example, to set the backend API URL).

4. **Run the frontend development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    - The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Additional Notes

- Make sure the backend is running before using the frontend, as the frontend will make API requests to it.
- You can use the provided Postman collection (`backend/docs/postman_collection.json`) to test the backend API endpoints.