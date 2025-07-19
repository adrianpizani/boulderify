import express from 'express';
import Boulder from '../models/Boulder.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try { 
        const Boulder = await Boulder.find();
        res.status(200).json(Boulder);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching boulders', error: error.message });
    }
})

router.post('/', async (req, res) => {
    try{
        const newBoulder = new Boulder(req.body)
        const saved = await newBoulder.save()
        res.status(201).json(saved)
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating boulder', error: error.message });
    }
})

export default router;