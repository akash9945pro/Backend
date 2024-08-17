import { Router } from "express";
import { loginUser, registerUser , logoutUser, refreshAccessToken} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.midelware.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.route("/register").post(
    upload.fields([
          {
            name : "avatar",
            maxCount: 1 
          },
          {
            name: "cover",
            maxCount: 1
          }
    ]),
    registerUser); 


router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT,loginUser)
router.route("/refresh-token").post(refreshAccessToken)



export default router;