# Starvision Backend

This is the backend service for the Starvision project, built with Go. It provides RESTful APIs for managing posts and connects to a MySQL database.

## Features

- RESTful API for posts (CRUD operations)
- MySQL database integration
- Environment-based configuration
- Input validation

## Getting Started

### Prerequisites

- Go 1.25 or higher
- MySQL database

### Setup

1. **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd starvision/starvision/backend
    ```

2. **Configure environment variables:**

    Copy `.env-example` to `.env` and update the values as needed:

    ```bash
    cp .env-example .env
    ```

3. **Install dependencies:**

    ```bash
    go mod tidy
    ```

4. **Run database migrations:**

    Import the SQL schema from `docs/posts_db.sql` into your MySQL database.

5. **Run the server:**

    ```bash
    go run main.go
    ```

    The server will start on the port specified in your `.env` file (default: 8080).

## API Endpoints

- `GET /posts` - List all posts
- `GET /posts/{id}` - Get a single post
- `POST /posts` - Create a new post
- `PUT /posts/{id}` - Update a post
- `DELETE /posts/{id}` - Delete a post
