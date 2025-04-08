
const bcrypt = require('bcrypt');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { options } = require('../routes/user');
require("dotenv").config();


//signup route handler
exports.signup=async(req, res)=>{
    try{
        //get data
        const {name, email, password, role}=req.body;

        //check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User alreadt exist",
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10); //Hashing ->ek fixed length k andar isko encrypt karna hai => we can't decrypt it later  //npmjs.com
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in hashing Password",
            })
        }
        //create entry for user
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message: "user created sucessfully",
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"user can not be registered"
        });
    }
}

//login route handler
exports.login = async(req, res)=>{
    try{
        //data fetch
        const {email, password} = req.body;

        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Please fill all the details",
            });
        }

        //check if the user is available
        let user = await User.findOne({email});

        //if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message: "user is not registered",
            });
        }

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }
        //varify password and generate a JWT token
        if(await bcrypt.compare(password, user.password)){
            //password matched
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"2h"}); //generated a JWT token using sign method

            user = user.toObject();
            //token ko user me daal diya
            user.token=token;
            //removed password from user's object, not from database
            user.password=undefined;

            //create options
            const options={
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            //create cookie
            return res.cookie("manishaCookie", token, options).status(200).json({
               success:true,
               token,
               user,
               message:'user logged in successfully', 
            });
        }
        else{
            //password did not match
            return res.status(403).json({
                success:false,
                message: "password incorrect",
            });
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message: "Login Failure",
        });      
    }
}