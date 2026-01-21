const NotesData = require("../routes/tempDB");
const NoteModel=require('../models/Note')


const CreateNotes=async(req,res)=>{

    try {
          const{title,content}=req.body;

    if(!title||!content){
        return res.status(400).json({
            message:"Title and content are required",
            success:false,

        })
    }
   const newNote=await NoteModel.create({
    title,
    content,
    user:req.user,
    
   });

    return res.status(201).json({
        success:true,
        message:"added notes successfully",
        data:newNote
    })
}
     catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
        
    }
  
}


const GetNotes=async(req,res)=>{
    try{
        console.log("getnotes:",req.user);
        const notes=await NoteModel.find({user:req.user}).sort({createdAt:-1}); //sorting basis on latest notes first
        return res.status(200).json({
        success:true,
        "data":notes
    })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error fetching notes",
            error:error.message
        })

    }

}



const RemoveNote=async(req,res)=>{

    try{
        const Id=req.params.id;

        const note=await NoteModel.findById(Id);
        if(!note){
            return res.status(404).json({
         success: false,
        message: "note not found",
            })
        }
        if(note.user.toString()!==req.user){
            return res.status(403).json({
        success: false,
        message: "Forbidden: you cannot delete this note",
      });
        }
        await NoteModel.deleteOne({_id:Id});

      
        return res.status(200).json({
            success:true,
            message:"Note deleted successfully",
            data:note
        })
         

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in deleting note",
            error:error.message
        })

    }
  
} 
  

const UpdateNote=async(req,res)=>{
  try{
      const Id=req.params.id;
    const{title,content}=req.body;
//     if(!title||!content){
//         return res.status(400).json({
//             success:false,
//             message:"Title and Content are required"
//         })
       

// }
 const note=await NoteModel.findById(Id);
        if(!note){
            return res.status(404).json({
         success: false,
        message: "note not found",
            })
        }
        if(note.user.toString()!==req.user){
            return res.status(403).json({
        success: false,
        message: "Forbidden: you cannot update this note",
      });
        }
const updatedNote=await NoteModel.findByIdAndUpdate(Id,
    {
        title,
        content,
    },
    {new:true}

);
if(!updatedNote){
    return res.status(404).json({
        success:false,
        message:"note not found"
    })
}

return res.status(200).json({
    success:true,
    message:"Note updated successfully",
    data:updatedNote
})

  }
  catch(error){
    return res.status(500).json({
        success:false,
        message:"Server Error",
        error:error.message,
    })

  }
}



module.exports={CreateNotes,GetNotes,RemoveNote,UpdateNote}