import { Router } from "express";
import { distributorSignup, distributorLogin, authenticateDistributorJWT, DistributorLogout } from "../controllers/destributor.controller.js";
import { registerRestaurant, getImageRestaurant, registerItem, getRestaurant, getRestaurantWithItems } from "../controllers/restaurant.controller.js";
import { upload } from "../utils/multer.js";
const DistributorRouter=Router();

DistributorRouter.route('/register').post(distributorSignup);
DistributorRouter.route('/login').post(distributorLogin);
DistributorRouter.route('/auth').post(authenticateDistributorJWT);
DistributorRouter.route('/logout').post(DistributorLogout);
DistributorRouter.route('/get-restaurant').post(getRestaurant);
DistributorRouter.route('/get-restaurant-dish').post(getRestaurantWithItems);

DistributorRouter.route('/get-res-info').post(getImageRestaurant);
DistributorRouter.route('/register-restaurant').post( upload.single('resimage'),registerRestaurant);
DistributorRouter.route('/register-restaurant-dish').post( upload.single('itemphoto'),registerItem);
export default DistributorRouter;