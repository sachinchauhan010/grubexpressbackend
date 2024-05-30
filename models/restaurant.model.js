import mongoose from "mongoose";
const restaurantSchema=new mongoose.Schema({
    resname:{
        type:String,
        required: true,
    },
    reslocation:{
        type:String,
        required: true,
    },
    restype:{
        type:String,
        required:true,
    },
    rescuisine:{
        type:Array,
        default:[],
    },
    resrating:{
        type:mongoose.Decimal128,
    },
    resImage:{
        type:String,
        required:true,
    },
    resowner:{
        type:String,
        required:true,
    },
    resopentime:{
        type:String,
        required:true,
    },
    resclosetime:{
        type:String,
        required:true,
    }
});

const Restaurant= mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;