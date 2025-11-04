package repositories

import (
	"database/sql"
	"time"

	"starvision/article/config"
	"starvision/article/models"
)

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository() *PostRepository {
	return &PostRepository{db: config.DB}
}

func (r *PostRepository) Create(req models.CreatePostRequest) (*models.Post, error) {
	now := time.Now()
	query := `INSERT INTO posts (title, content, category, status, created_at, updated_at) 
	         VALUES (?, ?, ?, ?, ?, ?)`

	result, err := r.db.Exec(query, req.Title, req.Content, req.Category, req.Status, now, now)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	post := &models.Post{
		ID:        int(id),
		Title:     req.Title,
		Content:   req.Content,
		Category:  req.Category,
		Status:    req.Status,
		CreatedAt: now,
		UpdatedAt: now,
	}

	return post, nil
}

func (r *PostRepository) GetByID(id int) (*models.Post, error) {
	query := `SELECT id, title, content, category, status, created_at, updated_at 
	         FROM posts WHERE id = ?`

	post := &models.Post{}
	err := r.db.QueryRow(query, id).Scan(
		&post.ID, &post.Title, &post.Content, &post.Category,
		&post.Status, &post.CreatedAt, &post.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return post, nil
}

func (r *PostRepository) GetAll(limit, offset int) (*models.PaginationResponse, error) {
	// Get total count
	countQuery := `SELECT COUNT(*) FROM posts`
	var totalCount int
	err := r.db.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		return nil, err
	}

	// Get paginated data
	query := `SELECT id, title, content, category, status, created_at, updated_at 
	         FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?`

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	posts := []models.Post{}
	for rows.Next() {
		post := models.Post{}
		err := rows.Scan(
			&post.ID, &post.Title, &post.Content, &post.Category,
			&post.Status, &post.CreatedAt, &post.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	response := &models.PaginationResponse{
		Data:       posts,
		Limit:      limit,
		Offset:     offset,
		TotalCount: totalCount,
	}

	return response, nil
}

func (r *PostRepository) Update(id int, req models.UpdatePostRequest) (*models.Post, error) {
	// First get the current post
	post, err := r.GetByID(id)
	if err != nil {
		return nil, err
	}

	if post == nil {
		return nil, nil
	}

	// Update fields if provided
	if req.Title != "" {
		post.Title = req.Title
	}
	if req.Content != "" {
		post.Content = req.Content
	}
	if req.Category != "" {
		post.Category = req.Category
	}
	if req.Status != "" {
		post.Status = req.Status
	}

	post.UpdatedAt = time.Now()

	query := `UPDATE posts SET title = ?, content = ?, category = ?, status = ?, updated_at = ? WHERE id = ?`

	_, err = r.db.Exec(query, post.Title, post.Content, post.Category, post.Status, post.UpdatedAt, id)
	if err != nil {
		return nil, err
	}

	return post, nil
}

func (r *PostRepository) Delete(id int) error {
	query := `DELETE FROM posts WHERE id = ?`
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
