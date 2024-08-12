import {v2 as cloudinary} from "cloudinary";

import fs from "fs";
import { loadEnvFile } from "process";






    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });



  const uploadOnCloudinary = async (loadEnvFilePath) => {
    try {
        if(!loadEnvFilePath)return null
        // upload the file on cloudinary
       const respons = await cloudinary.uploader.upload(locaFilePath,{
            resource_type : "auto"
        })

        // file has been uploaded succesfully
        console.log("file is uploaded on cloudinary",respons.url);
        return respons;
    }catch(error){
           
        fs.unlinkSync(localFilePath) // remove the localy saved temprary file as the uploded operation got fail
    }
  }


  export {uploadOnCloudinary}









    await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
