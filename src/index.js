// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import mongoose from "mongoose";
import connectDB from "./db/index.js";

dotenv.config({
  path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 800 , ()=>{
        console.log(`Server is running on port ${process.env.PORT}` 
    )})
})
.catch(()=>{
      console.log("MongoDB connection failed !!! ",err);
})












/** 
import express from "express"
const app = express()
(async()=> {

    try {

    await  mongoose.connect('${process.env.MONGODB_URL}/s{DB_NAME}')
    app.on("error",()=>{
        console.log("ERROR: ", error);
        throw error;
    })

    app.listen(process.env.PORT,()=>{
        console.log('App is listing on port  ${process.env.PORT}');
    })
    }catch(error){
              
    console.log("ERROR: ", error)
    throw error;

    }
})()




*/