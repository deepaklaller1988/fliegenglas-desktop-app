import React from 'react';

interface ErrorPopupProps {
    message: string;
    onClose: () => void;
    onSubmit?: () => void;
    heading?: string
    type: string
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose, heading, type, onSubmit }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-3/12">
                <h1 className='text-black'>{heading}</h1>
                <p className="text-center text-black text-sm mb-4 mt-4">{message}</p>

                <div className='flex flex-row gap-4'>
                    <button
                        className="w-full bg-gray-500 text-white py-1.5 rounded"
                        onClick={onClose}
                    >
                        {type == "delete" ? "NEIN" : "OK"}
                    </button>

                    {type == "delete" &&
                        <button
                            className="w-full bg-red-500  text-white py-1.5 rounded"
                            onClick={onSubmit}
                        >
                            JA
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default ErrorPopup;
