
const {CreateNotes, GetNotes,RemoveNote,UpdateNote}=require('../controllers/notesController')
const router=require('express').Router();

const {protect}=require('../middleware/authMiddleware')

router.get('/',protect,GetNotes);

router.post('/',protect,CreateNotes);

router.delete('/:id',protect,RemoveNote);
router.put('/:id',protect,UpdateNote);



module.exports=router;