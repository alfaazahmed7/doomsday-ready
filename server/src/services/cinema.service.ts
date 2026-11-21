import mongoose from 'mongoose';
import Cinema from '../models/cinema.model';

export class AppError extends Error {
    statusCode: number;
    code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
};

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

export interface BookingBundle {
    size: number;
    quantity: number;
}

export interface BookingResult {
    cinema: {
        _id: string;
        name: string;
        bundleSizes: number[];
    };
    groupSize: number;
    possible: boolean;
    bundles: BookingBundle[];
    totalBundles: number;
    totalSeats: number;
}

const calculateMinBundles = (bundleSizes: number[], groupSize: number): {
    possible: boolean;
    bundles: BookingBundle[];
    totalBundles: number;
} => {
    // Dynamic programming approach
    // dp[i] = minimum bundles needed for size i
    // We track the last bundle used to reconstruct the solution
    
    const MAX = groupSize + 1;
    const dp = new Array(MAX).fill(MAX);
    const lastBundle = new Array(MAX).fill(-1);
    
    dp[0] = 0;
    
    for (let i = 1; i <= groupSize; i++) {
        for (const size of bundleSizes) {
            if (i >= size && dp[i - size] + 1 < dp[i]) {
                dp[i] = dp[i - size] + 1;
                lastBundle[i] = size;
            }
        }
    }
    
    if (dp[groupSize] === MAX) {
        return { possible: false, bundles: [], totalBundles: 0 };
    }
    
    // Reconstruct the solution
    const bundlesMap = new Map<number, number>();
    let remaining = groupSize;
    
    while (remaining > 0) {
        const size = lastBundle[remaining];
        bundlesMap.set(size, (bundlesMap.get(size) || 0) + 1);
        remaining -= size;
    }
    
    const bundles: BookingBundle[] = [];
    for (const [size, quantity] of bundlesMap) {
        bundles.push({ size, quantity });
    }
    
    return {
        possible: true,
        bundles,
        totalBundles: dp[groupSize],
    };
};

export const createCinema = async (data: { name: string; bundleSizes: number[] }): Promise<Cinema> => {
    const { name, bundleSizes } = data;
    
    const trimmedName = name.trim();
    if (!trimmedName) {
        throw new AppError('Cinema name is required.', 400, 'MISSING_CINEMA_NAME');
    }
    
    const existingCinema = await Cinema.findOne({ name: trimmedName });
    if (existingCinema) {
        throw new AppError('Cinema with this name already exists.', 409, 'DUPLICATE_CINEMA_NAME');
    }
    
    const cinema = await Cinema.create({
        name: trimmedName,
        bundleSizes
    });
    
    return cinema;
};

export const getAllCinemas = async (): Promise<Cinema[]> => {
    return await Cinema.find();
};

export const calculateBooking = async (cinemaId: string, groupSize: number): Promise<BookingResult> => {
    if (!isValidObjectId(cinemaId)) {
        throw new AppError('Invalid cinema ID.', 400, 'INVALID_CINEMA_ID');
    }
    
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
        throw new AppError('Cinema not found.', 404, 'CINEMA_NOT_FOUND');
    }
    
    if (groupSize < 1 || groupSize > 10000) {
        throw new AppError('Group size must be between 1 and 10000.', 400, 'INVALID_GROUP_SIZE');
    }
    
    const result = calculateMinBundles(cinema.bundleSizes, groupSize);
    
    return {
        cinema: {
            _id: cinema._id.toString(),
            name: cinema.name,
            bundleSizes: cinema.bundleSizes
        },
        groupSize,
        possible: result.possible,
        bundles: result.bundles,
        totalBundles: result.totalBundles,
        totalSeats: result.possible ? groupSize : 0
    };
};