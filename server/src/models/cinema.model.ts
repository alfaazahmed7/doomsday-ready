import mongoose from 'mongoose';

interface ICinema {
    name: string;
    bundleSizes: number[];
}

const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    bundleSizes: {
        type: [Number],
        required: true
    }
});

const validateBundleSize = (sizes: number[]): void => {
    if (sizes.length < 1 || sizes.length > 10) {
        throw new Error('Must have at least 1 and at most 10 bundle sizes.');
    }
    for (const size of sizes) {
        if (!Number.isInteger(size)) {
            throw new Error('Bundle sizes must be integers.');
        }
        if (size < 1 || size > 500) {
            throw new Error('Bundle sizes must be between 1 and 500.');
        }
    }
    if (sizes.length !== [...new Set(sizes)].length) {
        throw new Error('Duplicate bundle sizes are not allowed.');
    }
};

cinemaSchema.pre('validate', function (next) {
    validateBundleSize(this.bundleSizes);
    next();
});

const Cinema = mongoose.model<ICinema>('Cinema', cinemaSchema);
export default Cinema;