import { Request, Response } from 'express';
import {
    createMovie,
    getAllMovies,
    updateMovie,
    getRewatchOrder,
    AppError
} from '../services/movie.service';

const handleError = (res: Response, error: unknown): Response => {
    if (error instanceof AppError) {
        console.error(error.message);
        return res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message
            }
        });
    }

    console.error('Unexpected server error:', error);
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.'
        }
    });
};

export const createMovieController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const movie = await createMovie(req.body);
        return res.status(201).json({
            success: true,
            message: 'Movie created successfully.',
            data: movie
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getAllMoviesController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const movies = await getAllMovies();
        return res.status(200).json({
            success: true,
            data: movies
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateMovieController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const movie = await updateMovie(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: 'Movie updated successfully.',
            data: movie
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getRewatchOrderController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const order = await getRewatchOrder(req.params.id);
        return res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        return handleError(res, error);
    }
};
