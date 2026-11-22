import express from 'express';
import {
    createCinemaController,
    getAllCinemasController,
    getBookingController
} from '../controllers/cinema.controller.js';

const router = express.Router();

router.post('/cinemas', createCinemaController);
router.get('/cinemas', getAllCinemasController);
router.get('/cinemas/:id/booking', getBookingController);

export default router;