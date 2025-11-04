import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Modal from './Modal';

const PostForm = ({ isOpen, onClose, onSubmit, loading, editingPost = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        content: editingPost.content || '',
        category: editingPost.category || '',
        status: editingPost.status || 'draft',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: '',
        status: 'draft',
      });
    }
    setErrors({});
  }, [editingPost, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 20) {
      newErrors.title = 'Title must be at least 20 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    } else if (formData.category.trim().length < 3) {
      newErrors.category = 'Category must be at least 3 characters';
    }

    if (!['publish', 'draft', 'trash'].includes(formData.status)) {
      newErrors.status = 'Invalid status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={editingPost ? 'Edit Post' : 'Create New Post'}
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title (min 20 characters)"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.title
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {formData.title.length} characters (minimum 20)
          </p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter post content (min 20 characters)"
            rows="8"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition resize-none ${
              errors.content
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {formData.content.length} characters (minimum 20)
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter category (min 3 characters)"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.category
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {formData.category.length} characters (minimum 3)
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.status
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
            <option value="trash">Trash</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingPost ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PostForm;