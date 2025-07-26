import React from 'react';

const ActionButton = ({ onClick, disabled, children, colorClass }) => (
    <button
        className={`w-16 h-16 text-3xl rounded-full shadow-xl transition-transform transform hover:scale-110 ${colorClass}`}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
);

export const ActionButtons = ({ isEditing, onStartEditing, onSave, onRemove, isUploading }) => {
    return (
        <div className="flex gap-6 mt-6">
            {!isEditing ? (
                <ActionButton onClick={onStartEditing} colorClass="bg-yellow-300 hover:bg-yellow-400">✏️</ActionButton>
            ) : (
                <ActionButton onClick={onSave} disabled={isUploading} colorClass="bg-green-400 hover:bg-green-500">
                    {isUploading ? '... ' : '💾'}
                </ActionButton>
            )}
            <ActionButton onClick={onRemove} colorClass="bg-red-400 hover:bg-red-500">❌</ActionButton>
        </div>
    );
};