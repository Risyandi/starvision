import React, { useEffect } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? Check : AlertCircle;

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50`}
    >
      <Icon size={20} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;