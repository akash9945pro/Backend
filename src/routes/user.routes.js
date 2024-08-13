import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.midelware.js"


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
    registerUser); // typo fixed: "registere" -> "register"

export default router;