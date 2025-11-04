import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, loading, title }) => {
  return (
    <Modal isOpen={isOpen} title="Delete Confirmation" onClose={onClose} size="sm">
      <div className="flex flex-col items-center gap-4">
        <AlertTriangle size={48} className="text-red-500" />
        <p className="text-center text-gray-700">
          Are you sure you want to delete the post <strong>{title}</strong>?
        </p>
        <p className="text-center text-sm text-gray-500">
          This action cannot be undone.
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;