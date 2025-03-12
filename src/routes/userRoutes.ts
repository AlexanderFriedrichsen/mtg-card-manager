import express from 'express';
// import all controller functions as a namespace
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';


const router = express.Router();


// Protected route

router.post('/register', userController.registerUser);
router.post('/login', authenticate, userController.loginUser);

// router.get('/profile', authenticate, userController.showUserProfile);

// router.get('/delete', authenticate, userController.deleteUser);

export default router;