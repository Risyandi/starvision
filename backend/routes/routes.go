package routes

import (
	"github.com/gorilla/mux"

	"starvision/article/handlers"
)

func SetupRoutes() *mux.Router {
	router := mux.NewRouter()
	postHandler := handlers.NewPostHandler()

	// Create a new post
	router.HandleFunc("/posts", postHandler.CreatePost).Methods("POST")

	// Get a single post
	router.HandleFunc("/posts/{id}", postHandler.GetPost).Methods("GET")

	// Get all posts with pagination
	router.HandleFunc("/articles/{limit}/{offset}", postHandler.GetAllPosts).Methods("GET")

	// Update a post
	router.HandleFunc("/posts/{id}", postHandler.UpdatePost).Methods("PUT")

	// Delete a post
	router.HandleFunc("/posts/{id}", postHandler.DeletePost).Methods("DELETE")

	return router
}
