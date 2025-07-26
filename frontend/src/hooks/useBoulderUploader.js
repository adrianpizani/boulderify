import { useState } from 'react';
import { uploadBoulder } from '../services/boulderService';
import { generateThumbnail } from '../utils/canvasUtils';

export const useBoulderUploader = (marks, imgRef, canvasRef) => {
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const saveBoulder = async (name) => {
        if (!image) {
            setUploadError("Please select an image first.");
            return false;
        }
        if (!name) {
            setUploadError("Please enter a name for the boulder.");
            return false;
        }

        setIsUploading(true);
        setUploadError(null);

        try {

            const img = imgRef.current;
            const canvas = canvasRef.current;

            if (!img || !canvas || !img.complete) {
                setUploadError("Image not fully loaded. Please wait a moment and try again.");
                return false;
            }

            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            const displayWidth = img.offsetWidth;
            const displayHeight = img.offsetHeight;

            const scaleX = naturalWidth / displayWidth;
            const scaleY = naturalHeight / displayHeight;
            console.log(`Scale X: ${scaleX}, Scale Y: ${scaleY}`);

            const scaledMarks = marks.map(mark => ({
                x: mark.x * scaleX,
                y: mark.y * scaleY,
                tool: mark.tool
            }));

            const formData = new FormData();
            const imageDataBlob = dataURItoBlob(image);
            formData.append('image', imageDataBlob);

            const thumbnail = generateThumbnail(img, canvas);
            if (thumbnail) {
                const thumbnailBlob = dataURItoBlob(thumbnail);
                formData.append('thumbnail', thumbnailBlob);
            } else {
                setUploadError("Failed to generate thumbnail. Please try again.");
                return false;
            }

            formData.append('marks', JSON.stringify(scaledMarks));
            formData.append('name', name);

            await uploadBoulder(formData);
            setImage(null); // Reset image after successful upload
            return true;
        } catch (error) {
            setUploadError(error.message || "Failed to upload boulder.");
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    return { image, isUploading, uploadError, handleImageChange, removeImage, saveBoulder };
};