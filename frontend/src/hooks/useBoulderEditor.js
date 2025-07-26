import { useState, useEffect } from 'react';
import { drawMark, getRelativeCoords } from '../utils/canvasUtils';

export const useBoulderEditor = (canvasRef, isEditing, imageSrc) => {
    const [marks, setMarks] = useState([]);
    const [activeTool, setActiveTool] = useState('hand');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && isEditing) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw lines between hand marks
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'rgba(255, 27, 167, 0.96)';
            ctx.beginPath();
            let firstHand = true;
            marks.forEach(mark => {
                if (mark.tool === "hand") {
                    if (firstHand) {
                        ctx.moveTo(mark.x, mark.y);
                        firstHand = false;
                    } else {
                        ctx.lineTo(mark.x, mark.y);
                    }
                }
            });
            ctx.stroke();

            // Draw all icons
            marks.forEach(mark => drawMark(ctx, mark.x, mark.y, mark.tool));
        }
    }, [marks, isEditing, canvasRef, imageSrc]);

    const handleCanvasClick = (event) => {
        if (!isEditing) return;

        const { x, y } = getRelativeCoords(event, canvasRef.current);
        const newMark = { x, y, tool: activeTool };

        if (activeTool === 'eraser') {
            setMarks(prevMarks => {
                const newMarks = prevMarks.filter(mark => {
                    const distance = Math.sqrt(Math.pow(mark.x - x, 2) + Math.pow(mark.y - y, 2));
                    return distance > 10; // 10 is the eraser radius
                });
                return newMarks;
            });
        } else {
            setMarks(prevMarks => [...prevMarks, newMark]);
        }
    };

    const clearMarks = () => {
        setMarks([]);
    };

    return { marks, activeTool, setActiveTool, handleCanvasClick, clearMarks };
};