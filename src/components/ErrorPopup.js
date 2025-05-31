import React from 'react';

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-red-600 text-lg font-bold mb-4">Erreur</h2>
        <p>{message}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;