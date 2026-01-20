require('dotenv').config();
const express=require('express');
const cors=require('cors');
const app=express();
const notesRoute=require('./src/routes/NotesRoutes')
const connectDB=require('./src/config/db')
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Hello world');
})
const PORT=process.env.PORT||5000;

app.use('/api/notes',notesRoute);


connectDB();
app.listen(5000,()=>{
    console.log(`server is running on port ${PORT}`);
})