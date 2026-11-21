import mongoose from 'mongoose';

interface IMovie {
    title: string,
    releaseYear: number,
    runtime: number,
    prerequisites: mongoose.Types.ObjectId[],
    watched: boolean
};

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    runtime: {
        type: Number,
        required: true
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }],
    watched: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Movie = mongoose.model<IMovie>('Movie', movieSchema);
export default Movie;