
const bcrypt = require('bcrypt');
const User = require("../models/User");


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