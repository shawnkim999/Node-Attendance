import { Router } from "express";
import {
    userSignup,
    userLogin
} from '../controllers/authController';
import { validateRequest } from "../middleware/validateRequest";
import { createUserSchema, loginUserSchema } from "../schema/user.schema";

const router = Router();

router.post("/signup", validateRequest(createUserSchema), userSignup);
router.post("/login", validateRequest(loginUserSchema), userLogin);

export default router;