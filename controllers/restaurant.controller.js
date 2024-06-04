import Restaurant from "../models/restaurant.model.js";
import { Item } from "../models/restaurantItem.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const registerRestaurant = async (req, res) => {

    const { resid, resname, reslocation, resdescription, restype, resowner, resopentime, resclosetime, rescuisine } = req.body;

    const resImageLocalPath = req.file ? req.file.path : null;

    try {
        if (!resid || !resname || !reslocation || !restype || !resowner || !resopentime || !resclosetime) {
            return res.status(400).json({
                success: false,
                message: `${!resid ? "Restaurant Id" : !resname ? "Restaurant Name" : !reslocation ? "Location" : !restype ? "Image" : !resowner ? "Owner" : !resopentime ? "Open Time" : "Close Time"} is required`,
            });
        }

        if (!resImageLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Upload the restaurant Photo",
            })
        }

        const isexistRestaurant = await Restaurant.findOne({ resid });
        if (isexistRestaurant) {
            return res.status(400).json({
                success: false,
                message: "Restaurant is already Registered",
            });
        }

        const uploadResImageResponse = await uploadOnCloudinary(resImageLocalPath);
        if (!uploadResImageResponse) {
            return res.status(500).json({
                success: false,
                message: "File is not uploaded on Cloudinary",
            })
        }
        const newRestaurant = new Restaurant({ resid, resname, reslocation,resdescription, restype, resowner, rescuisine, resopentime, resclosetime, resimage: uploadResImageResponse.url });
        const saveToDB = await newRestaurant.save();
        if (!saveToDB) {
            return res.status(500).json({
                success: false,
                message: "Restaurant Data is not saved to Database",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Restaurant registered Succesfully",
        })
    } catch (error) {
        console.log("Error in Register the restaurant", error.message);
        return res.status(500).json({
            success: false,
            message: "Restaurant is not registered Succesfully",
        })
    }
}

const getImageRestaurant = async (req, res) => {
    const { resname } = req.body;
    const restaurant = await Restaurant.findOne({ resname });
    if (!restaurant) {
        console.log("Error in finding res");
        return res.status(404).json({ error: "Restaurant not found" });
    }
    return res.json({ resImage: restaurant.resImage });
};

const registerItem = async (req, res) => {
    const { itemname, itemdescription, itemprice, iteminstock } = req.body;
    const itemImageLocalPath = req.file ? req.file.path : null;

    try {

        if (!itemname || !itemprice || !iteminstock) {
            return res.status(400).json({
                success: false,
                message: `${!itemname ? "Item Name" : !itemprice ? "Item Price" : "Item in Stock"}, is required`,
            });
        }

        const isexistItem = await Restaurant.findOne({ itemname });
        if (isexistItem) {
            return res.status(400).json({
                success: false,
                message: "Restaurant dish is already registered"
            });
        }
        const itemResponse = await uploadOnCloudinary(itemImageLocalPath);
        if (!itemResponse) {
            return res.status(500).json({
                success: false,
                message: "File is not uploaded on Cloudinary",
            })
        }

        const newItem = new Item({ itemname, itemphoto: itemResponse.url, itemdescription, itemprice, iteminstock });
        const savedItem = await newItem.save();
        if (!savedItem) {
            return res.status(500).json({
                success: false,
                message: "Restaurant dish Data is not saved to Database",
            })
        }
        // TODO: make resid generalize
        let updatecuisines = await Restaurant.findOneAndUpdate({ resid: 'IND259' }, { $push: { rescuisine: { itemname: itemname, itemid: savedItem._id } } },{ new: true });
        if (updatecuisines) {
            return res.status(200).json({
                success: true,
                message: "Restaurant dish added to restaurant Succesfully",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Restaurant dish registered Succesfully",
        });

    } catch (error) {
        console.log("Error in Register the restaurant dish", error.message);
        return res.status(500).json({
            success: false,
            message: "Restaurant dish is not registered Succesfully",
        })
    }
}

const getRestaurant = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        if (restaurants.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No restaurants found",
            });
        }
        return res.status(200).json({
            success: true,
            data: restaurants,
        });
    } catch (error) {
        console.error("Error finding restaurants:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve restaurants from the database",
        });
    }
};
const getRestaurantWithItems = async (req, res) => {

    //TODO: retrive resid from params
    const {resid}=req.body;
    try {
        const restaurant = await Restaurant.findOne({ resid: resid }).populate('rescuisine.itemid');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        console.log("Error retrieving restaurant with items", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve restaurant with items"
        });
    }
};





export { registerRestaurant, getImageRestaurant, registerItem, getRestaurant,getRestaurantWithItems };