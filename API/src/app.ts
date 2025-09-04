import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { sanitizeInput } from './middleware/sanitizeInput';

dotenv.config();

//import routes

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(errorHandler);

// app use '/', router

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});