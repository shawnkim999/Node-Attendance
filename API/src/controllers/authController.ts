import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import {
    getCache,
    setCache,
    deleteCache
} from '../services/redisService';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import logger from "../utils/logger";
import {
    createUserSchema,
    loginUserSchema
} from "../schema/user.schema";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace in production
const JWT_EXPIRES_IN = '1h';

export const userSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password, role = 'USER' } = req.body;

        const existingUser = await prisma.user.findUnique({ where: email });
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { username, email, password: hashedPassword, role },
        });

        // const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
        //     expiresIn: JWT_EXPIRES_IN,
        // });

        logger.info(`User registered: ${newUser.email}`);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        next(err);
    };
}

export const userLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: email });

        if (!user) {
            logger.warn(`Login failed: email not found - ${email}`);
            res.status(401).json({ error: "Invalid email" });
            return;
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login failed: wrong password - ${email}`);
            res.status(401).json({ error: "Invalid password" });
            return;
        };

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        logger.info(`User logged in: ${user.email}`);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    };
}