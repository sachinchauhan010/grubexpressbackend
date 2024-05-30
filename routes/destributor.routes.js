import { Router } from "express";
import { distributorSignup, distributorLogin, authenticateDistributorJWT, DistributorLogout } from "../controllers/destributor.controller.js";
import { registerRestaurant, getImageRestaurant } from "../controllers/restaurant.controller.js";
import { upload } from "../utils/multer.js";
const DistributorRouter=Router();

DistributorRouter.route('/signup').post(distributorSignup);
DistributorRouter.route('/login').post(distributorLogin);
DistributorRouter.route('/auth').post(authenticateDistributorJWT);
DistributorRouter.route('/logout').post(DistributorLogout);
DistributorRouter.route('/get-res-info').post(getImageRestaurant);
DistributorRouter.route('/register-restaurant').post( upload.single('resImage'),registerRestaurant);

export default DistributorRouter;