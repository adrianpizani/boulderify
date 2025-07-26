import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useBoulderEditor } from "../hooks/useBoulderEditor";
import { useBoulderUploader } from "../hooks/useBoulderUploader";
import { ImageCanvas } from "../components/ImageCanvas";
import { Toolbar } from "../components/Toolbar";
import { ActionButtons } from "../components/ActionButtons";
import { ImageUploader } from "../components/ImageUploader";

export default function UploadBoulder() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('New Boulder'); // Add name state
    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const navigate = useNavigate();

    const { marks, activeTool, setActiveTool, handleCanvasClick, clearMarks } = useBoulderEditor(canvasRef, isEditing, imgRef.current?.src);
    const { image, isUploading, handleImageChange, removeImage, saveBoulder } = useBoulderUploader(marks, imgRef, canvasRef);

    const handleStartEditing = () => {
        if (image) setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        saveBoulder(name).then(() => {
            // Optional: Navigate away or show success message
        });
    };

    const handleRemove = () => {
        removeImage();
        clearMarks();
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-8 items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-800">Upload Boulder</h1>

            {!image ? (
                <ImageUploader onImageChange={handleImageChange} />
            ) : (
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <ImageCanvas
                            image={image}
                            isEditing={isEditing}
                            canvasRef={canvasRef}
                            imgRef={imgRef}
                            onCanvasClick={handleCanvasClick}
                        />
                        <ActionButtons
                            isEditing={isEditing}
                            onStartEditing={handleStartEditing}
                            onSave={handleSave}
                            onRemove={handleRemove}
                            isUploading={isUploading}
                        />
                    </div>

                    {isEditing && (
                        <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
                    )}
                </div>
            )}
             <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700">
                Back to Home
            </button>
        </div>
    );
}