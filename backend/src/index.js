import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import boulderRoutes from './routes/boulders.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());

connectDB();

app.listen(process.env.PORT || 3002, () => { console.log(`Server is running on port ${process.env.PORT || 3002}`); });

app.get('/health', (req, res) => { res.json({ status: 'ok', timestamp: new Date().toISOString() });});

// Define routes
app.use('/api/boulders', boulderRoutes);


