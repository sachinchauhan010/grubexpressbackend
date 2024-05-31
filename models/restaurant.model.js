import mongoose from "mongoose";
const restaurantSchema=new mongoose.Schema({
    resid:{
        type:String,
        required:true,
        unique:true,
    },
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
    rescuisine: [{
        itemname: String,
        itemid: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
    }],
    resrating:{
        type:mongoose.Decimal128,
    },
    resdescription:{
        type:String,
    },
    resimage:{
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