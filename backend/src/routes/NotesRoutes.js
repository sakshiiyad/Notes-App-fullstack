
const {CreateNotes, GetNotes,RemoveNote,UpdateNote}=require('../controllers/notesController')
const router=require('express').Router();

router.get('/',GetNotes);

router.post('/',CreateNotes);

router.delete('/:id',RemoveNote);
router.put('/:id',UpdateNote);



module.exports=router;