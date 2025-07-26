import mongoose  from "mongoose";

const BoulderSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    thumbnailUrl: String,
    marks: [Object],
    createdBy: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Boulder', BoulderSchema);