import express from 'express';
const router = express.Router();

import { registerUser, verifyUser, loginUser, logoutUser, forgotPassword, verifyOtp, resetPassword } from "../controllers/userController.js";
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { validateUser, userSchema } from '../validators/userValidate.js';

router.post('/register', validateUser(userSchema), registerUser);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp/:email', verifyOtp);
router.post('/reset-password/:email', resetPassword);

export default router;