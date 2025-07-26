export const getRelativeCoords = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
};

export const drawMark = (ctx, x, y, tool) => {
    const radius = 10;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);

    switch (tool) {
        case 'hand':
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
        case 'foot':
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
        case 'top':
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
        case 'eraser':
            ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
            break;
        default:
            break;
    }
};

export const getIcon = (tool) => {
    switch (tool) {
        case 'hand':
            return '✋';
        case 'foot':
            return '🦶';
        case 'top':
            return '🧗';
        case 'eraser':
            return '🧼';
        default:
            return '';
    }
};

export const generateThumbnail = (imgElement, canvasElement) => {
    if (!imgElement || !canvasElement || !imgElement.complete || imgElement.naturalWidth === 0) {
        return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = imgElement.offsetWidth;
    canvas.height = imgElement.offsetHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(imgElement, 0, 0, imgElement.offsetWidth, imgElement.offsetHeight);
    ctx.drawImage(canvasElement, 0, 0);

    return canvas.toDataURL("image/png");
};