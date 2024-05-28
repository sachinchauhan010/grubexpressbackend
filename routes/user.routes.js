import {Router} from 'express';
import express from 'express';
import { authenticateJWT, registerUser, userLogin, userLogout} from '../controllers/user.controller.js';


const router=Router();
const app=express();

router.route('/register').post(registerUser);
router.route('/auth').post(authenticateJWT);
router.route('/login').post(userLogin);
router.route('/logout').post(userLogout);

export default router;