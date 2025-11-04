package validators

import (
	"errors"
	"strings"

	"starvision/article/models"
)

var validStatuses = map[string]bool{
	"publish": true,
	"draft":   true,
	"trash":   true,
}

func ValidateCreatePost(req models.CreatePostRequest) error {
	if strings.TrimSpace(req.Title) == "" {
		return errors.New("title is required")
	}

	if len(strings.TrimSpace(req.Title)) < 20 {
		return errors.New("title must be at least 20 characters")
	}

	if strings.TrimSpace(req.Content) == "" {
		return errors.New("content is required")
	}

	if len(strings.TrimSpace(req.Content)) < 20 {
		return errors.New("content must be at least 20 characters")
	}

	if strings.TrimSpace(req.Category) == "" {
		return errors.New("category is required")
	}

	if len(strings.TrimSpace(req.Category)) < 3 {
		return errors.New("category must be at least 3 characters")
	}

	if strings.TrimSpace(req.Status) == "" {
		return errors.New("status is required")
	}

	statusLower := strings.ToLower(strings.TrimSpace(req.Status))
	if !validStatuses[statusLower] {
		return errors.New("status must be 'publish', 'draft', or 'trash'")
	}

	return nil
}

func ValidateUpdatePost(req models.UpdatePostRequest) error {
	if strings.TrimSpace(req.Title) != "" && len(strings.TrimSpace(req.Title)) < 20 {
		return errors.New("title must be at least 20 characters")
	}

	if strings.TrimSpace(req.Content) != "" && len(strings.TrimSpace(req.Content)) < 20 {
		return errors.New("content must be at least 20 characters")
	}

	if strings.TrimSpace(req.Category) != "" && len(strings.TrimSpace(req.Category)) < 3 {
		return errors.New("category must be at least 3 characters")
	}

	if strings.TrimSpace(req.Status) != "" {
		statusLower := strings.ToLower(strings.TrimSpace(req.Status))
		if !validStatuses[statusLower] {
			return errors.New("status must be 'publish', 'draft', or 'trash'")
		}
	}

	return nil
}
