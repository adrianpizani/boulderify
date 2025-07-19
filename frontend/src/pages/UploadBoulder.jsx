import { useEffect, useState, useRef } from "react";

export default function UploadBoulder() {
    const [image, setImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTool, setActiveTool] = useState(null); 
    const [marks, setMarks] = useState([]); 

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setMarks([]); // Reset marks when a new image is uploaded
        }
    }

    const handleCanvasClick = (e) => {
        if (!activeTool) return;    
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activeTool === "eraser") {
            const threshold = 20;
            const indexToRemove = marks.findIndex(
                (mark) => Math.hypot(mark.x - x, mark.y - y) < threshold
            );
    
            if (indexToRemove !== -1) {
                const updatedMarks = [...marks];
                updatedMarks.splice(indexToRemove, 1);
                setMarks(updatedMarks);
                drawAll(); // Redibuja todo menos lo borrado
            }
    
        } else {
            const newMark = { x, y, tool: activeTool };
            const updatedMarks = [...marks, newMark];
            setMarks(updatedMarks);
    
            // Solo dibuja el nuevo icono (sin la línea)
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.font = "20px sans-serif";
            ctx.fillText(getIcon(activeTool), x - 10, y + 10);
        }
    }

    const handleToolChange = (tool) => () =>{
        setActiveTool(tool);
    }        

    const removeImage = () => {
        setImage(null); 
        setIsEditing(false);
        setActiveTool(null);
        setMarks([]); // Clear marks when image is removed
    }

    const confirmBoulder = () => {
        if (marks.length > 0) 
            drawAll();
    }

    const stopEditing = () => {
        setIsEditing(false);
        setActiveTool(null);
        setMarks([]); // Clear marks when editing stops
    }

    const startEditing = () => {
        if (image) {
            setIsEditing(true);
        }
    }

    useEffect(() => { 
        if(isEditing && canvasRef.current && imgRef.current) {
            const canvas = canvasRef.current;
            const img = imgRef.current;
            // Set canvas size to match image
            canvas.width = img.offsetWidth;
            canvas.height = img.offsetHeight;
        }
    }, [isEditing, image]);

    const drawAll = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.linewidth = 5;
        ctx.strokeStyle = 'rgba(255, 27, 167, 0.96)'; //Todo: mejorar el color de la linea, que sea mas visible, lineas curvas y mas gruesas
        
        ctx.beginPath();
        for (let i = 0; i < marks.length; i++) {
            const { x, y, tool } = marks[i];
            if (tool === "foot" || tool === "eraser" ) continue; 
            if (i === 0)
              ctx.moveTo(x, y);
            else
              ctx.lineTo(x, y);
            }
        ctx.stroke();

        for (const { x, y, tool } of marks) {
            ctx.font = "20px sans-serif";
            ctx.fillText(getIcon(tool), x - 10, y + 10);
        }
    };


    // Mover a utils
    const getIcon = (tool) => {
        switch (tool) {
          case "hand": return "✋";
          case "foot": return "🦶";
          case "top": return "🏁";
          case "zone": return "🔵";
          default: return "❓";
        }
    };

    const generateThumbnail = () => {
        const img = imgRef.current;
        const overlay = canvasRef.current;
    
        if (!img || !overlay) return null;
    
        // Crear un canvas temporal
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
    
        // Dibuja la imagen original
        ctx.drawImage(img, 0, 0);
    
        // Dibuja el canvas (líneas e íconos)
        ctx.drawImage(overlay, 0, 0);
    
        // Exportar como base64
        return canvas.toDataURL("image/png");
    };

    const saveBoulder = async () => {
        const thumbnail = generateThumbnail();

        if (!image || !thumbnail || marks.length === 0) {
            alert("Faltan datos para guardar el boulder.");
            return;
        }

            // Convertir la imagen original en archivo (Blob)
        const originalBlob = await fetch(image).then(res => res.blob());
        const thumbnailBlob = await fetch(thumbnail).then(res => res.blob());

        const formData = new FormData();
        formData.append("image", originalBlob, "boulder.png");
        formData.append("thumbnail", thumbnailBlob, "thumbnail.png");
        formData.append("marks", JSON.stringify(marks));
        formData.append("name", "Nuevo Boulder");

        try {
            const response = await fetch("http://localhost:3001/api/boulders", {
                method: "POST",
                body: formData
            });
    
            if (response.ok) {
                alert("Boulder guardado!");
            } else {
                console.error("Error al guardar:", await response.text());
                alert("Error al guardar el boulder.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión.");
        }
    }

    return (
        <div className="min-h-screen bg-white p-6 flex flex-col gap-6 items-center justify-center">
        <h2 className="text-2xl font-bold">Upload a boulder pic</h2>

            {!image && (
                <label className="cursor-pointer w-28 h-28 flex items-center justify-center rounded-full bg-blue-100 text-4xl hover:bg-blue-200 shadow-xl">
                ➕
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                </label>
            )}

            {image && (
                <>
                <div className="relative inline-block">
                    {isEditing && (
                        <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 rounded-xl border border-blue-300"
                        onClick={handleCanvasClick}
                        />
                    )}
                    <img
                        ref={imgRef}
                        src={image}
                        alt="preview"
                        className="max-w-xs rounded-xl shadow-lg"
                    />
                </div>

                { isEditing && (
                    <>
                        /** Cambiar esto por un foco en el boton */
                        <div className="flex gap-6 mt-6">
                            <h2 className="text-2xl font-bold">Active tool: {activeTool}</h2>
                        </div>

                        <div className="flex gap-6 mt-6">
                            <button className="w-14 h-14 text-2xl rounded-full bg-yellow-100 hover:bg-yellow-200 shadow" onClick={handleToolChange("hand")}>✋</button>
                            <button className="w-14 h-14 text-2xl rounded-full bg-green-100 hover:bg-green-200 shadow" onClick={handleToolChange("foot")}>🦶</button>
                            <button className="w-14 h-14 text-2xl rounded-full bg-red-100 hover:bg-red-200 shadow" onClick={handleToolChange("top")}>🚩</button>
                            <button className="w-14 h-14 text-2xl rounded-full bg-red-100 hover:bg-red-200 shadow" onClick={handleToolChange("eraser")}>🧽</button>
                            <button className="w-14 h-14 text-2xl rounded-full bg-green-200 hover:bg-green-300 shadow" onClick={confirmBoulder}>✅</button>
                        </div>
                    </>
                )}
                

                <div className="flex gap-6 mt-6">
                    <button className="w-14 h-14 text-2xl rounded-full bg-yellow-100 hover:bg-yellow-200 shadow"
                        onClick={startEditing}>✏️</button>
                    <button className="w-14 h-14 text-2xl rounded-full bg-green-100 hover:bg-green-200 shadow"
                        onClick={saveBoulder}>💾</button>
                    <button className="w-14 h-14 text-2xl rounded-full bg-red-100 hover:bg-red-200 shadow"
                        onClick={removeImage}>❌
                    </button>
                </div>
                
               </>
            )}

        </div>
      )

}