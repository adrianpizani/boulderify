import express from 'express';
import { getAllBoulders, createBoulder, deleteBoulder, getBoulderById, updateBoulder } from '../controllers/boulderController.js';
import { uploadMiddleware, s3UploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Definición de rutas
router.route('/')
    .get(getAllBoulders)
    .post(uploadMiddleware, s3UploadMiddleware, createBoulder)

router.route('/:id')
    .delete(deleteBoulder)
    .put(updateBoulder) // s3UploadMiddleware,  --> todo later
    .get(getBoulderById); // Assuming you have a getBoulderById controller

export default router;