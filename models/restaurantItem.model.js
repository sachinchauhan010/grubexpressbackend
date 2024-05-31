import mongoose from "mongoose";

const restaurantItemSchema=new mongoose.Schema({
    itemname:{
        type:String,
        required: true,
        unique:true,
    },

    itemphoto:{
        type:String,
        required:true,
    },
    
    itemdescription:{
        type:String,
    },

    itemprice:{
        type:Number,
        required:true,
    },

    iteminstock:{
        type:String,
        required:true,
    }

});

const Item=new mongoose.model('Item', restaurantItemSchema);

export {Item};