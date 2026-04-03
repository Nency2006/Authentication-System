import express from 'express';
import 'dotenv/config';
import connectDb from './database/db.js';
const port = process.env.PORT || 8000;
import userRoutes from './routes/userRoutes.js';


const app = express();
connectDb();

app.use(express.json());

app.use('/user', userRoutes);



app.listen(port, ()=>{
    
    console.log(`Server is running on port ${port}`);
})