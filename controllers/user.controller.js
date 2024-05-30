import jwt from 'jsonwebtoken'
import User from "../models/userSignup.model.js";
import bcrypt from 'bcryptjs';
import { asyncHandler } from "../utils/asyncHandler.js";
import express from 'express';
import mongoose from 'mongoose';


// TODO: Bug in Production: 1. When we try to add to cart an item then it automatically delete the token and show the toast user logged out
// TODO:                    2. On refresh token is deleted

export const getUserId=(req)=>{
    const encodedToken=req.cookies.token
    if (!encodedToken) {
        return null;
    //    return res.status(401).json({
    //      success: false,
    //      message: 'Authentication token is missing',
    //    });
     }
    const decodedToken= jwt.verify(encodedToken, process.env.JWT_SECRET);
    const id=decodedToken.id;
    return id;
}

const registerUser =asyncHandler( async (req, res) => {

    const { name, phoneno, email, password } = req.body;

    try {
        if (!name || !phoneno || !email || !password) {
            return res.status(400).json({
                success: false,
                message: `${!name ? "Name" : !phoneno ? "Contact Number" : !email ? "Email" : "Password"} is required`,
            });
        }

        const existingUser = await User.findOne({ phoneno });
        console.log(existingUser, "&&&&&&&&&&&&&&&&");
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

const userLogin =asyncHandler( async (req, res) => {
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
            secure: process.env.NODE_ENV === 'production' || false,
            sameSite: 'strict',
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
const authenticateJWT=(req, res)=>{
    const token=req.cookies.token;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({
            success: true,
            message: "User is Logged, In",
        });
    }else{
        return res.status(401).json({
            success:false,
            message: 'User is not Logged In'
        });
    }
}

const userLogout=async (req, res)=>{
    const options = {
        httpOnly: true,
        secure: true,
      };
    res.clearCookie('token', options);
    try {
        delete req.cookies.token;
        const tokenCookie=req.cookies.token;
        if(!tokenCookie){
            return res.status(200).json({
                success:true,
                message: "Logout Successfully",
            })
        }else{
            return res.status(500).json({
                success:false,
                message: "Logout unsucess",
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }

}


const addToCart=asyncHandler(async(req, res)=>{
   try {
    const {itemId}=req.body;
     let updatedCart= await User.findOneAndUpdate({_id:getUserId(req)}, {$push:{cart:itemId}});
     return res.status(200).json({
        success:true,
        message:"Item is added to cart",
    })
   } catch (error) {
    console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
   }
});

const getUserCart= asyncHandler(async(req, res)=>{
    const user= await User.findById(getUserId(req));
    return res.status(200).json({
        sucess:true,
        message:"Item is added to cart",
        userCart:user.cart,
    })
})


export { registerUser, userLogin, authenticateJWT, userLogout, addToCart, getUserCart};
