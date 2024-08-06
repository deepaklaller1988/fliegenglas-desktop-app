import React from 'react';

interface ErrorPopupProps {
    message: string;
    onClose: () => void;
    heading:string
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose,heading }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-3/12">
                <h1 >{heading}</h1>
                <p className="text-center text-sm mb-4 mt-4">{message}</p>
                <button
                    className="w-full yellow button text-white py-2 rounded"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default ErrorPopup;
