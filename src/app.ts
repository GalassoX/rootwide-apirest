import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CONSTANTS } from './data/config';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import sampRoutes from './routes/samp.routes';
import soporteRoutes from './routes/soporte.routes';
import discordRoutes from './routes/discord.routes';

const app = express();

app.set('port', CONSTANTS.PORT);

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(userRoutes);
app.use(sampRoutes);
app.use(soporteRoutes);
app.use(discordRoutes);

export default app;