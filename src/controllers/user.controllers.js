import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

export { registerUser };
