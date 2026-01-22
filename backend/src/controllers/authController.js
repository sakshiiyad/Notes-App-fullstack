const UserModel = require("../models/User");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const Signup=async(req,res)=>{
    try{

        const {name,email,password}=req.body;

        //validation
        if(!name||!email||!password){
            return res.status(400).json({
                success:false,
                message:"All the fields are required"
            })
        }
        //check user existence
    const user=await UserModel.findOne({email});
    if(user){
        return res.status(409).json({
            success:false,
            message:"User already exists"

        })
    }
    //hash password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
     //create
    const newUser=await UserModel.create({
        name,
        email,
        password:hashedPassword
    });
    //generate jwt token
    const token=jwt.sign(
        {id:newUser._id},
        process.env.JWT_SECRET,
       {expiresIn:"7d"}
    )
    console.log(token);
    //response
    return res.status(201).json({
        success:true,
        message:"user created successfully",
        user:{
            id:newUser._id,
            name:newUser.name,
            email:newUser.email,
        },
        token,
    })
    }
  catch(error){
    console.log("Signup Error:",error)
    return res.status(500).json({
        message:"Internal server error",
        success:false

    });

  }

}

const Login=async(req,res)=>{
  try{
      const{email,password}=req.body;
      if(!email||!password){
        return res.status(400).json({
            success:false,
            message:"email and password both are required"
        })
      }
      const user=await UserModel.findOne({email});
      if(!user){
        return res.status(401).json({
            success:false,
            message:"user does not exists"
        })

      }
      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res.status(401).json({
            success:"false",
            message:"Invalid Credentials"
        })
      }
      const token=jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"},
      )
      return res.status(200).json({
        success:true,
        message:"Login Successfull",
        token,
        user:{
            id:user._id,
            email:user.email
        }
      })
  }catch(error){
    return res.status(500).json({
        success:false,
        message:"Internal Server Error",
        error:error.message
    })
  }

}
module.exports={
    Signup,
    Login
}