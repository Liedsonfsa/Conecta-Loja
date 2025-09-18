import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.creteUser(req.body);
        res.status(201).json({ users: user});
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};