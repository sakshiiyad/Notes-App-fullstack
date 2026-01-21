require('dotenv').config();
const express=require('express');
const cors=require('cors');
const app=express();
app.use(express.json());
const notesRoute=require('./src/routes/NotesRoutes')
const authRoute=require('./src/routes/authRoutes')
const connectDB=require('./src/config/db')

app.use(cors());

app.get('/',(req,res)=>{
    res.send('Hello world');
})
const PORT=process.env.PORT||5000;

app.use('/api/notes',notesRoute);
app.use('/auth',authRoute);


connectDB();
app.listen(5000,()=>{
    console.log(`server is running on port ${PORT}`);
})