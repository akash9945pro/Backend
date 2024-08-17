import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async(userId)=>{
    try{

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ValidateBeforeSave : false})

        return {accessToken,refreshToken}
    }catch{

        throw new ApiError(500, "something went wrong while generating and access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { fullname, email, username, password } = req.body;
    console.log("email", email);

    // Ensure all fields are present and not empty
    if ([fullname, email, username, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    // check for image, check for avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.cover?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // upload them on Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const cover = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // create user object - create entry in db
    const user = await User.create({
        fullname, 
        email, 
        username: username.toLowerCase(), 
        password, 
        avatar: avatar.url, 
        coverImage: cover?.url || "",
    });

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    );
});

const loginUser = asyncHandler(async (req,res) => {
     // req body -> data

     const {email , username , password} = req.body

     if(!(username || email)){
        throw new ApiError(400 , "username or email is required")
     }


     // check for user existence
      const user = await User.findOne({
        $or: [{ email }, { username: username.toLowerCase() }],
      })

      if(!user){
        throw new ApiError(404, "User not found")
      }

    
     // password check
      const isValidPassword = await user.isPasswordCorrect(password)
      if(!isValidPassword){
        throw new ApiError(401, "Invalid password")
      }


     // access and refresh token
      const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)


     // send cookies 
     const loggedInUser = await User.findById(user._id)

     const options = {
            
         httpOnly : true,
         secure : true

     }


     return res.
     status(200).
     cookie("accessToken",accessToken,options).
     cookie("refreshToken",refreshToken,options).
     json(new ApiResponse(200,
        {user: loggedInUser,accessToken,
        refreshToken},
        "User logged in successfully"
     ))
})


const logoutUser = asyncHandler(async(req,res) =>{
   await  User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )  


    const options = {
      
        httpOnly : true,
        secure : true

    }

    return  res.
    status(200).
    clearCookie("accessToken",options).
    clearCookie("refreshToken",options).
    json(new ApiResponse(200,"User logged out successfully"))
})



const refreshAccessToken = asyncHandler(async(req,res)=>{
      const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
      if(incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
      }

try {
    
         const decodedToken = jwt.verify(
            incomingRefreshToken , 
            process.env.REFRESH_TOKEN_SECRET
          )
    
        const user = await  User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
    
    
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
        return res.
        status(200).
        cookie("accessToken",accessToken).
        cookie("refreshToken",refreshAccessToken).
        json(new ApiResponse(200,"Access token generated successfully"))
    
        
} catch (error) {
           throw new ApiError(401,error?.message || 
            "Invalid refresh token")
           
   }




})


export { registerUser ,
    loginUser,
    logoutUser,
    refreshAccessToken
};
