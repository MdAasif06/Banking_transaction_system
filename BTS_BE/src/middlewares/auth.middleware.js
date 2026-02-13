import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access,token is missing",
        status: "failed",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // const user=await userModel.findById(decode._id).select("-password")
    const user = await userModel.findById(decode.userId); //select() is not need because alredy false in userModel
    //  ADD THIS CHECK
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        status: "failed",
      });
    }
    req.user = user;
    return next();
  } catch (error) {
    console.log("middleware error while verify auhorization", error);
    return res.status(401).json({
      message: "Unauthorized access,token is invalid",
      status: "failed",
    });
  }
};

export const authSystemUserMiddleware=async(req,res,next)=>{
  try {
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({
      message:"Unauthorized access token is missing"
    })
  }
  const decode=jwt.verify(token,process.env.JWT_SECRET)
  const user= await userModel.findById(decode.userId).select("+systemUser")
  if(!user.systemUser){
    
  }
  } catch (error) {
    
  }

}
