package main

import (
	"log"
	"net/http"
	"os"

	"starvision/article/config"
	"starvision/article/routes"
)

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Database credentials - use environment variables in production
	dbUsername := os.Getenv("DB_USER")
	if dbUsername == "" {
		dbUsername = "root"
	}

	dbPassword := os.Getenv("DB_PASSWORD")

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "posts_db"
	}

	// Initialize database
	err := config.InitDB(dbUsername, dbPassword, dbHost, dbPort, dbName)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer config.CloseDB()

	// Setup routes
	router := routes.SetupRoutes() // or your router setup function

	// Wrap router with CORS middleware
	http.Handle("/", corsMiddleware(router))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
