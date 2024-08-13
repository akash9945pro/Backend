import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const  registerUser = asyncHandler( async(req,res)=>{
    
    // get user details from frontend
    const {fullname,email,username,password} =  req.body
    console.log("email" , email);


    // vallidation - not empty
     if([fullname, email, username, password].some((filed) =>
    filed.trim() === "")){
        throw new ApiError(400,"all fileds are  required")

     }


    // check if user already exists : username , email
    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with username or email alredy exist")
    }


    // check for image , checccck for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const  coverImageLocalPath =   req.files?.coverImege[0]?.path;

    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }


    // upload them on clodinary , avatar 
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const cover = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar is required")
    }



    // create user in object - create intery in db
    const user = await User.create({
        fullname, email, username: username.toLowerCase(), password, avatar : avatar.url , coverImage: coverImage?.url || "",

    })



  // remove password and refresh token filed  from responce
  const createdUser =   await User.findById(user._id).select(
    "-password -refreshToken" 
  )




    // check for user creation
    if(!createdUser){

        throw new ApiError(500, "something went wrong while registering user")
    }




    // return response
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User created successfully")
        )



} )


export {registerUser}