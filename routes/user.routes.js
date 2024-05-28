import {Router} from 'express';
import express from 'express';
import { authenticateJWT, registerUser, userLogin, userLogout, addToCart, getUserCart} from '../controllers/user.controller.js';


const router=Router();
const app=express();

router.route('/register').post(registerUser);
router.route('/auth').post(authenticateJWT);
router.route('/login').post(userLogin);
router.route('/logout').post(userLogout);
router.route('/add-to-cart').post(addToCart);
router.route('/get-user-cart').post(getUserCart);

export default router;