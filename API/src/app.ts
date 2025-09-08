import { env } from './config/env';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { sanitizeInput } from './middleware/sanitizeInput';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { testDbConnection } from './lib/db';
import logger from './utils/logger';

dotenv.config();

//import routes
import authRoutes from './routes/authRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(errorHandler);
app.use(sanitizeInput);
app.use(loggerMiddleware);

// app use '/', router
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await testDbConnection();
        app.listen(PORT, () => {
            logger.info(`Server is listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        logger.error('Failed to start server:', err);
        process.exit(1);
    };
};

startServer();