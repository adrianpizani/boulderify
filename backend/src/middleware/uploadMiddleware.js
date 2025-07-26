import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';

// Configurar Multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware para subir archivos a S3
const uploadToS3 = async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next();
    }

    try {
        const { image, thumbnail } = req.files;

        if (image && image[0]) {
            const imageName = `boulders/${Date.now()}_${image[0].originalname}`;
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: imageName,
                Body: image[0].buffer,
                ContentType: image[0].mimetype,
            });
            await s3Client.send(command);
            req.body.imageUrl = `${process.env.S3_PUBLIC_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${imageName}`;
        }

        if (thumbnail && thumbnail[0]) {
            const thumbnailName = `thumbnails/${Date.now()}_${thumbnail[0].originalname}`;
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: thumbnailName,
                Body: thumbnail[0].buffer,
                ContentType: thumbnail[0].mimetype,
            });
            await s3Client.send(command);
            req.body.thumbnailUrl = `${process.env.S3_PUBLIC_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${thumbnailName}`;
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error uploading to S3', error: error.message });
    }
};

// Exportar el middleware de Multer y el de S3
export const uploadMiddleware = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]);
export const s3UploadMiddleware = uploadToS3;
