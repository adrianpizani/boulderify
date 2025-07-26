import React from 'react';

export const ImageUploader = ({ onImageChange }) => (
    <label className="cursor-pointer w-32 h-32 flex items-center justify-center rounded-full bg-blue-100 text-5xl hover:bg-blue-200 shadow-xl transition-transform transform hover:scale-105">
        ➕
        <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
        />
    </label>
);