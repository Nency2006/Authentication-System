import mongoose from "mongoose";

const connectDb = async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URL}/note-app`);
        console.log("mongoDb connected successfully")
    }
    catch(error){
        console.log("mongodb connection error", error)
    }
}

export default connectDb;