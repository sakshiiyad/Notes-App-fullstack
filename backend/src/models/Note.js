const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const NoteSchema=new Schema({
    title:{
        type:String,
        required:true
        
    },
    content:{
        type:String,
        required:true
        
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
        
        
    },
},
    {timestamps:true}
        
    

);
const NoteModel=mongoose.model("note",NoteSchema);

module.exports=NoteModel;