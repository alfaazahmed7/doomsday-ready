import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Doomsday Ready server in running properly');
});

// routes imports
import movieRoutes from './routes/movie.routes.js';
import cinemaRoutes from './routes/cinema.routes.js';

// routes
app.use('/api', movieRoutes);
app.use('/api', cinemaRoutes);

export default app;