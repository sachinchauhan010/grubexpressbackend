import {Router} from 'express';
import express from 'express';
import { authenticateJWT, registerUser, userLogin} from '../controllers/user.controller.js';


const router=Router();
const app=express();

router.route('/register').post(registerUser);
// app.use(authenticateJWT);
router.route('/login').post(authenticateJWT,userLogin);

export default router;