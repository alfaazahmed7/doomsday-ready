import { Request, Response } from 'express';
import {
    createCinema,
    getAllCinemas,
    calculateBooking,
    AppError
} from '../services/cinema.service';

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

export const createCinemaController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const cinema = await createCinema(req.body);
        return res.status(201).json({
            success: true,
            message: 'Cinema created successfully.',
            data: cinema
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getAllCinemasController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const cinemas = await getAllCinemas();
        return res.status(200).json({
            success: true,
            data: cinemas
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getBookingController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { groupSize } = req.query;

        if (groupSize === undefined || typeof groupSize !== 'string') {
            throw new AppError('Group size is required.', 400, 'MISSING_GROUP_SIZE');
        }

        const groupSizeNum = parseInt(groupSize, 10);
        if (isNaN(groupSizeNum)) {
            throw new AppError('Group size must be a valid integer.', 400, 'INVALID_GROUP_SIZE');
        }

        const booking = await calculateBooking(id, groupSizeNum);
        return res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        return handleError(res, error);
    }
};