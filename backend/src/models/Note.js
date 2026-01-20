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
    tags:{
        type:[String],
        default:[],
        
        
    },
},
    {timestamps:true}
        
    

);
const NoteModel=mongoose.model("note",NoteSchema);

module.exports=NoteModel;