const mongoose=require('mongoose');
const mongo_url=process.env.MONGO_URI;

console.log(mongo_url);
const connectDB=async()=>{
    try {
        
console.log(mongo_url);
await mongoose.connect(mongo_url)
console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error in connecting to mongoDB",error);
        process.exit(1);
        
    }

}
module.exports=connectDB;