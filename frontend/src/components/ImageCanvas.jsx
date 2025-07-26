import React, { useEffect } from 'react';

export const ImageCanvas = ({ image, isEditing, canvasRef, imgRef, onCanvasClick }) => {

    useEffect(() => {
        if (isEditing && canvasRef.current && imgRef.current) {
            const canvas = canvasRef.current;
            const img = imgRef.current;
            // Set canvas size to match image after it has loaded
            const setCanvasSize = () => {
                canvas.width = img.offsetWidth;
                canvas.height = img.offsetHeight;
            };

            if (img.complete) {
                setCanvasSize();
            } else {
                img.onload = setCanvasSize;
            }
        }
    }, [isEditing, image, canvasRef, imgRef]);

    return (
        <div className="relative inline-block">
            {isEditing && (
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 rounded-xl border border-blue-300"
                    onClick={onCanvasClick}
                />
            )}
            <img
                ref={imgRef}
                src={image}
                alt="Boulder preview"
                className="max-w-xs rounded-xl shadow-lg"
            />
        </div>
    );
};