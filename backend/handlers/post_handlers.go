package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"starvision/article/models"
	"starvision/article/repositories"
	"starvision/article/validators"
)

type PostHandler struct {
	repo *repositories.PostRepository
}

func NewPostHandler() *PostHandler {
	return &PostHandler{
		repo: repositories.NewPostRepository(),
	}
}

func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req models.CreatePostRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Invalid request body",
			Error:   err.Error(),
		})
		return
	}

	// Validate
	err = validators.ValidateCreatePost(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Validation error",
			Error:   err.Error(),
		})
		return
	}

	post, err := h.repo.Create(req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Failed to create post",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(models.ApiResponse{
		Success: true,
		Message: "Post created successfully",
		Data:    post,
	})
}

func (h *PostHandler) GetPost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Invalid post ID",
			Error:   err.Error(),
		})
		return
	}

	post, err := h.repo.GetByID(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Failed to fetch post",
			Error:   err.Error(),
		})
		return
	}

	if post == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Post not found",
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.ApiResponse{
		Success: true,
		Message: "Post fetched successfully",
		Data:    post,
	})
}

func (h *PostHandler) GetAllPosts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	limit, err := strconv.Atoi(vars["limit"])
	if err != nil || limit <= 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Invalid limit parameter",
			Error:   "limit must be a positive integer",
		})
		return
	}

	offset, err := strconv.Atoi(vars["offset"])
	if err != nil || offset < 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Invalid offset parameter",
			Error:   "offset must be a non-negative integer",
		})
		return
	}

	response, err := h.repo.GetAll(limit, offset)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Failed to fetch posts",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.ApiResponse{
		Success: true,
		Message: "Posts fetched successfully",
		Data:    response,
	})
}

func (h *PostHandler) UpdatePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Invalid post ID",
			Error:   err.Error(),
		})
		return
	}

	var req models.UpdatePostRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Invalid request body",
			Error:   err.Error(),
		})
		return
	}

	// Validate
	err = validators.ValidateUpdatePost(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Validation error",
			Error:   err.Error(),
		})
		return
	}

	post, err := h.repo.Update(id, req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Failed to update post",
			Error:   err.Error(),
		})
		return
	}

	if post == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Post not found",
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.ApiResponse{
		Success: true,
		Message: "Post updated successfully",
		Data:    post,
	})
}

func (h *PostHandler) DeletePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Invalid post ID",
			Error:   err.Error(),
		})
		return
	}

	err = h.repo.Delete(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ApiResponse{
			Success: false,
			Message: "Failed to delete post",
			Error:   err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.ApiResponse{
		Success: true,
		Message: "Post deleted successfully",
	})
}
