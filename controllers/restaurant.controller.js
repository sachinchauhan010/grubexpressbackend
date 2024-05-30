import Restaurant from "../models/restaurant.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerRestaurant = async (req, res) => {

    const { resname, reslocation, restype, rescuisine, resowner, resopentime, resclosetime } = req.body;

    const resImageLocalPath = req.file ? req.file.path : null;

    try {
        if (!resname || !reslocation || !restype || !resImage || !resowner || !resopentime || !resclosetime) {
            return res.status(400).json({
                success: false,
                message: `${!resname ? "Restaurant Name" : !reslocation ? "Location" : !restype ? "Type" : !resImage ? "Image" : !resowner ? "Owner" : !resopentime ? "Open Time" : "Close Time"} is required`,
            });
        }

        if (!resImageLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Upload the restaurant Photo",
            })
        }

        const uploadResImageResponse = await uploadOnCloudinary(resImageLocalPath);
        if(!uploadOnCloudinary){
            return res.status(500).json({
                success:false,
                message:"File is not uploaded on Cloudinary",
            })
        }
        const newRestaurant = new Restaurant({resname, reslocation, restype, rescuisine, resowner, resopentime, resclosetime, resImage: uploadResImageResponse.url });
        const saveToDB=await newRestaurant.save();
        if(!saveToDB){
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


export { registerRestaurant, getImageRestaurant };