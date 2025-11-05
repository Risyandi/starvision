import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import TabNavigation from "../components/TabNavigation";
import Pagination from "../components/Pagination";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Toast from "../components/Toast";
import { postsAPI } from "../services/api";
import useApi from "../hooks/useApi";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    all: 0,
    publish: 0,
    draft: 0,
    trash: 0,
  });

  const { loading, data, execute } = useApi();
  const {
    loading: submitLoading,
    error: submitError,
    execute: executeSubmit,
  } = useApi();
  const { loading: deleteLoading, execute: executeDelete } = useApi();

  // Fetch posts on tab or page change
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [activeTab, currentPage]);

  // Fetch statistics on mount
  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async () => {
    const offset = (currentPage - 1) * postsPerPage;
    const response = await execute(postsAPI.getPosts, postsPerPage, offset);

    if (response) {
      let filteredPosts = response.data;

      if (activeTab !== "all") {
        filteredPosts = filteredPosts.filter(
          (post) => post.status === activeTab
        );
      }

      // Store filtered data
      if (
        !data ||
        JSON.stringify(data.data) !== JSON.stringify(filteredPosts)
      ) {
        // Update would happen through component re-render
      }
    }
  };

  const fetchStatistics = async () => {
    try {
      // Fetch all statuses to get counts
      const allResponse = await executeSubmit(postsAPI.getPosts, 1000, 0);
      if (allResponse) {
        const posts = allResponse.data;
        setStats({
          all: posts.length,
          publish: posts.filter((p) => p.status === "publish").length,
          draft: posts.filter((p) => p.status === "draft").length,
          trash: posts.filter((p) => p.status === "trash").length,
        });
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let response;

      if (editingPost) {
        response = await executeSubmit(
          postsAPI.updatePost,
          editingPost.id,
          formData
        );
      } else {
        response = await executeSubmit(postsAPI.createPost, formData);
      }

      if (response) {
        setToast({
          message: editingPost
            ? "Post updated successfully!"
            : "Post created successfully!",
          type: "success",
        });
        setIsFormOpen(false);
        setCurrentPage(1);
        fetchPosts();
        fetchStatistics();
      } else if (submitError) {
        setToast({
          message: submitError,
          type: "error",
        });
      }
    } catch (err) {
      setToast({
        message: "An error occurred",
        type: "error",
      });
    }
  };

  const handleConfirmDelete = async () => {
    const deleted = await executeDelete(postsAPI.deletePost, postToDelete.id);

    if (deleted !== null) {
      setToast({
        message: "Post deleted successfully!",
        type: "success",
      });
      setIsDeleteOpen(false);
      setPostToDelete(null);
      setCurrentPage(1);
      fetchPosts();
      fetchStatistics();
    } else {
      setToast({
        message: "Failed to delete post",
        type: "error",
      });
    }
  };

  const tabs = [
    { id: "all", label: "All Posts", count: stats.all },
    { id: "publish", label: "Published", count: stats.publish },
    { id: "draft", label: "Drafts", count: stats.draft },
    { id: "trash", label: "Trashed", count: stats.trash },
  ];

  let displayPosts = data?.data || [];
  if (activeTab !== "all") {
    displayPosts = displayPosts.filter((post) => post.status === activeTab);
  }

  const totalCount = data?.total_count || 0;
  const totalPages = Math.ceil(totalCount / postsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Posts Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your blog posts and articles
              </p>
            </div>
            <button
              onClick={handleAddPost}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              <Plus size={20} />
              Add New Post
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <PostList
            posts={displayPosts}
            loading={loading}
            onEdit={handleEditPost}
            onDelete={handleDeleteClick}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        )}
      </main>

      {/* Post Form Modal */}
      <PostForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        loading={submitLoading}
        editingPost={editingPost}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title={postToDelete?.title}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
