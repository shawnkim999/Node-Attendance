import { Request, Response } from "express";
import prisma from "../lib/prisma";
import {
    getCache,
    setCache,
    deleteCache
} from '../services/redisService';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

export const userSignup = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ error: "Must have " })
    }

    
}