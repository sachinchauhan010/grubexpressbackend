import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneno: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: Array,
        default: [{}],
    },
    order: {
        type: Array,
        default: [{}],
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
