const jwt=require('jsonwebtoken');

const protect=(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        console.log(authHeader)
        if(!authHeader){
            return res.status(401).json({
                success:false,
                message:"Not authorized, token missing "
            })
        }
        const decodedtoken=jwt.verify(authHeader,process.env.JWT_SECRET);
        console.log(decodedtoken);
        req.user=decodedtoken.id
        next();

    }catch(error){
        return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    })
}
}
module.exports={protect};