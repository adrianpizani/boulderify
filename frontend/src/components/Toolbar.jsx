import React from 'react';
import { getIcon } from '../utils/canvasUtils';

const ToolButton = ({ tool, activeTool, onClick }) => (
    <button
        className={`w-14 h-14 text-2xl rounded-full shadow-md transition-transform transform hover:scale-110 ${
            activeTool === tool ? 'bg-blue-400 ring-4 ring-blue-200' : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => onClick(tool)}
    >
        {getIcon(tool)}
    </button>
);

export const Toolbar = ({ activeTool, onToolChange }) => {
    const tools = ["hand", "foot", "top", "eraser"];

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Tools</h3>
            <div className="flex gap-4">
                {tools.map((tool) => (
                    <ToolButton key={tool} tool={tool} activeTool={activeTool} onClick={onToolChange} />
                ))}
            </div>
        </div>
    );
};