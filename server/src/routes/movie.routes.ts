import express from 'express';
import {
    createMovieController,
    getAllMoviesController,
    updateMovieController,
    getRewatchOrderController
} from '../controllers/movie.controller';

const router = express.Router();

router.post('/movies', createMovieController);
router.get('/movies', getAllMoviesController);
router.patch('/movies/:id', updateMovieController);
router.get('/movies/:id/rewatch-order', getRewatchOrderController);

export default router;
