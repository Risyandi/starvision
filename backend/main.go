package main

import (
	"log"
	"net/http"
	"os"

	"starvision/article/config"
	"starvision/article/routes"
)

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
	router := routes.SetupRoutes()

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
