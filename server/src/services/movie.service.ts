import mongoose from 'mongoose';
import Movie from '../models/movie.model.js';

export class AppError extends Error {
    statusCode: number;
    code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

interface MovieData {
    title: string;
    releaseYear: number;
    runtime: number;
    prerequisites?: string[];
}

interface PopulatedMovie {
    _id: mongoose.Types.ObjectId;
    title: string;
    releaseYear: number;
    runtime: number;
    prerequisites: PopulatedMovie[];
    watched: boolean;
}

const validatePrerequisites = async (
    prerequisiteIds: string[],
    excludeMovieId?: string
): Promise<void> => {
    for (const id of prerequisiteIds) {
        if (!isValidObjectId(id)) {
            throw new AppError('Invalid prerequisite ID.', 400, 'INVALID_PREREQUISITE_ID');
        }
    }

    const uniqueIds = [...new Set(prerequisiteIds)];
    if (uniqueIds.length !== prerequisiteIds.length) {
        throw new AppError('Duplicate prerequisites are not allowed.', 400, 'DUPLICATE_PREREQUISITES');
    }

    for (const id of prerequisiteIds) {
        const movie = await Movie.findById(id);
        if (!movie) {
            throw new AppError('One or more prerequisite movies do not exist.', 400, 'PREREQUISITE_NOT_FOUND');
        }
    }

    if (excludeMovieId && prerequisiteIds.includes(excludeMovieId)) {
        throw new AppError('A movie cannot be its own prerequisite.', 400, 'SELF_DEPENDENCY');
    }
};

const hasCircularDependency = async (movieId: string, prerequisiteIds: string[]): Promise<boolean> => {
    if (prerequisiteIds.includes(movieId)) {
        return true;
    }

    const visited = new Set<string>(prerequisiteIds);

    const dfs = async (id: string): Promise<boolean> => {
        const movie = await Movie.findById(id).select('prerequisites');
        if (!movie) {
            return false;
        }

        for (const prereq of movie.prerequisites) {
            const prereqId = prereq.toString();
            if (prereqId === movieId) {
                return true;
            }
            if (visited.has(prereqId)) {
                continue;
            }
            visited.add(prereqId);
            if (await dfs(prereqId)) {
                return true;
            }
        }
        return false;
    };

    for (const prereqId of prerequisiteIds) {
        if (await dfs(prereqId)) {
            return true;
        }
    }
    return false;
};

export const createMovie = async (data: MovieData): Promise<PopulatedMovie> => {
    const { title, releaseYear, runtime, prerequisites = [] } = data;

    if (!title || typeof releaseYear !== 'number' || typeof runtime !== 'number') {
        throw new AppError('All required fields must be provided.', 400, 'MISSING_REQUIRED_FIELDS');
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
        throw new AppError('Title is required.', 400, 'MISSING_REQUIRED_FIELDS');
    }

    if (Number.isNaN(releaseYear)) {
        throw new AppError('Release year must be a valid number.', 400, 'INVALID_RELEASE_YEAR');
    }

    if (runtime < 1 || runtime > 300) {
        throw new AppError('Runtime must be between 1 and 300 minutes.', 400, 'INVALID_RUNTIME');
    }

    await validatePrerequisites(prerequisites);

    const existingMovie = await Movie.findOne({ title: trimmedTitle });
    if (existingMovie) {
        throw new AppError('Movie with this title already exists.', 409, 'DUPLICATE_TITLE');
    }

    const movie = await Movie.create({
        title: trimmedTitle,
        releaseYear,
        runtime,
        prerequisites,
        watched: false
    });

    const populatedMovie = await Movie.findById(movie._id).populate(
        'prerequisites',
        'title releaseYear runtime watched'
    );
    return populatedMovie as unknown as PopulatedMovie;
};

export const getAllMovies = async (): Promise<PopulatedMovie[]> => {
    const movies = await Movie.find().populate(
        'prerequisites',
        'title releaseYear runtime watched'
    );
    return movies as unknown as PopulatedMovie[];
};

export const updateMovie = async (
    id: string,
    data: Partial<MovieData> & { watched?: boolean }
): Promise<PopulatedMovie> => {
    if (!isValidObjectId(id)) {
        throw new AppError('Invalid movie ID.', 400, 'INVALID_OBJECT_ID');
    }

    const movie = await Movie.findById(id);
    if (!movie) {
        throw new AppError('Movie not found.', 404, 'MOVIE_NOT_FOUND');
    }

    const { title, releaseYear, runtime, prerequisites, watched } = data;

    if (title !== undefined) {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            throw new AppError('Title is required.', 400, 'MISSING_REQUIRED_FIELDS');
        }
        const existingMovie = await Movie.findOne({
            title: trimmedTitle,
            _id: { $ne: movie._id }
        });
        if (existingMovie) {
            throw new AppError('Movie with this title already exists.', 409, 'DUPLICATE_TITLE');
        }
        movie.title = trimmedTitle;
    }

    if (releaseYear !== undefined) {
        if (typeof releaseYear !== 'number' || Number.isNaN(releaseYear)) {
            throw new AppError('Release year must be a valid number.', 400, 'INVALID_RELEASE_YEAR');
        }
        movie.releaseYear = releaseYear;
    }

    if (runtime !== undefined) {
        if (typeof runtime !== 'number' || runtime < 1 || runtime > 300) {
            throw new AppError('Runtime must be between 1 and 300 minutes.', 400, 'INVALID_RUNTIME');
        }
        movie.runtime = runtime;
    }

    if (watched !== undefined) {
        if (typeof watched !== 'boolean') {
            throw new AppError('Watched status must be a boolean.', 400, 'INVALID_WATCHED');
        }
        movie.watched = watched;
    }

    if (prerequisites !== undefined) {
        await validatePrerequisites(prerequisites, movie._id.toString());
        if (await hasCircularDependency(movie._id.toString(), prerequisites)) {
            throw new AppError('Circular movie dependency detected.', 409, 'CIRCULAR_DEPENDENCY');
        }
        movie.prerequisites = prerequisites.map(
            (id) => new mongoose.Types.ObjectId(id)
        );
    }

    try {
        await movie.save();
    } catch (error: any) {
        if (error.code === 11000) {
            throw new AppError('Movie with this title already exists.', 409, 'DUPLICATE_TITLE');
        }
        throw error;
    }

    const populatedMovie = await Movie.findById(movie._id).populate(
        'prerequisites',
        'title releaseYear runtime watched'
    );
    return populatedMovie as unknown as PopulatedMovie;
};

export const getRewatchOrder = async (movieId: string): Promise<PopulatedMovie[]> => {
    if (!isValidObjectId(movieId)) {
        throw new AppError('Invalid movie ID.', 400, 'INVALID_OBJECT_ID');
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
        throw new AppError('Movie not found.', 404, 'MOVIE_NOT_FOUND');
    }

    const result: PopulatedMovie[] = [];
    const visited = new Set<string>();

    const dfs = async (id: string): Promise<void> => {
        if (visited.has(id)) {
            return;
        }
        visited.add(id);

        const current = await Movie.findById(id).populate(
            'prerequisites',
            'title releaseYear runtime watched'
        );
        if (!current) {
            return;
        }

        const prerequisites = current.prerequisites as unknown as PopulatedMovie[];
        for (const prereq of prerequisites) {
            await dfs(prereq._id.toString());
        }

        result.push(current as unknown as PopulatedMovie);
    };

    // Start DFS from the prerequisites of the target movie
    // to exclude the target movie itself from the result
    const prerequisites = movie.prerequisites as unknown as PopulatedMovie[];
    for (const prereq of prerequisites) {
        await dfs(prereq._id.toString());
    }
    return result;
};
