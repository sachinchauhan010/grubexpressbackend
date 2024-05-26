import jwt from 'jsonwebtoken'
import User from "../models/userSignup.model.js";
import bcrypt from 'bcryptjs';
import { asyncHandler } from "../utils/asyncHandler.js";
import express from 'express';
const registerUser = asyncHandler(async (req, res) => {
    console.log("API called");

    const { name, phoneno, email, password } = req.body;

    try {
        if (!name || !phoneno || !email || !password) {
            return res.status(400).json({
                success: false,
                message: `${!name ? "Name" : !phoneno ? "Contact Number" : !email ? "Email" : "Password"} is required`,
            });
        }

        const existingUser = await User.findOne({ phoneno });
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "You are already Registered via this phone no",
            });
        }
        let salt = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({ name, phoneno, email, password: hashPassword });

        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "User registered Succesfully",
        })


    } catch (error) {
        console.log(error, "&&&&&&&&");
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {

        const isExistUser = await User.findOne({ email });
        if (!isExistUser) {
            return res.status(401).json({
                sucess: false,
                message: "Email is Not registered",
            })
        }
        const hashPassword = isExistUser.password;
        const isCorrectPassword = bcrypt.compareSync(password, hashPassword);

        if (!isCorrectPassword) {
            return res.status(401).json({
                sucess: false,
                message: "Password is incorrect",
            })
        }
        const token = jwt.sign({ id: isExistUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
        });
        return res.status(200).json({
            success: true,
            message: "User logged in Succesfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

//Auth using JWT
const authenticateJWT=(req, res, next)=>{
    const token=req.cookies.token;
    const router=express.Router();
    router.redirect
    if(token){
        jwt.verify(token, process.env.JWT_SECRET);

        return res.json({
            login: true,
            data: 'decode'
        });
    }else{
        // return res.redirect(301, '/login');
        return res.json({
            login: false,
            data: 'error'
        });
    }
    next();
}




export { registerUser, userLogin, authenticateJWT };
