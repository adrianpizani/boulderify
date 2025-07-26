import Boulder from '../models/Boulder.js';
import s3Client from '../config/s3.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

// @desc    Get all boulders
// @route   GET /api/boulders
// @access  Public
export const getAllBoulders = async (req, res) => {
    try {
        const boulders = await Boulder.find();
        res.status(200).json(boulders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching boulders', error: error.message });
    }
};

// @desc    Create a new boulder
// @route   POST /api/boulders
// @access  Public
export const createBoulder = async (req, res) => {
    try {
        const { name, imageUrl, thumbnailUrl, marks } = req.body;

        const newBoulder = new Boulder({
            name,
            imageUrl,
            thumbnailUrl,
            marks: JSON.parse(marks),
            createdBy: '60d5ec49f8c7d00015f8e3b1', // Placeholder for user ID, replace with actual user ID from auth
        });
        const saved = await newBoulder.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error('Error creating boulder:', error);
        res.status(500).json({ message: 'Error creating boulder', error: error.message });
    }
};

// @desc    Delete a boulder and its image from S3
// @route   DELETE /api/boulders/:id
// @access  Public
export const deleteBoulder = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Find the boulder in the DB to get its details
        const boulderToDelete = await Boulder.findById(id);

        if (!boulderToDelete) {
            return res.status(404).json({ message: 'Boulder not found' });
        }

        // 2. If there is an image URL, delete the object from S3
        if (boulderToDelete.imageUrl) {
            // Extract the 'key' (filename) from the URL
            const s3Key = boulderToDelete.imageUrl.split('/').pop();

            const deleteParams = {
                Bucket: process.env.S3_BUCKET_NAME, // Make sure to set this in your .env file
                Key: s3Key,
            };

            // Send the delete command to S3
            await s3Client.send(new DeleteObjectCommand(deleteParams));
        }

        // 3. Finally, delete the boulder from the database
        await Boulder.findByIdAndDelete(id);

        res.status(200).json({ message: 'Boulder deleted successfully' });
    } catch (error) {
        console.error('Error deleting boulder:', error);
        res.status(500).json({ message: 'Error deleting boulder', error: error.message });
    }
};

export const getBoulderById = async (req, res) => {
    const { id } = req.params;
    try {
        const boulder = await Boulder.findById(id);
        if (!boulder) {
            return res.status(404).json({ message: 'Boulder not found' });
        }
        res.status(200).json(boulder);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching boulder', error: error.message });
    }
}

export const updateBoulder = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedBoulder = await Boulder.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBoulder) {
            return res.status(404).json({ message: 'Boulder not found' });
        }
        res.status(200).json(updatedBoulder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating boulder', error: error.message });
    }
};