import React from 'react';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react';

const PostList = ({ posts, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <MoreHorizontal size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">No posts found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Created
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900 truncate" title={post.title}>
                  {post.title}
                </p>
              </td>
              <td className="px-6 py-4">
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {post.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    post.status === 'publish'
                      ? 'bg-green-100 text-green-700'
                      : post.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(post)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    title="Edit post"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(post)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete post"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;