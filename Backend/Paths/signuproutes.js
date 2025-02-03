const express=require("express")
const { registerUser, loginUser}=require("../Handlers/signupcontroller");


const router=express.Router();
router.post("/signup",registerUser)
router.post ("/login",loginUser)
module.exports=router;