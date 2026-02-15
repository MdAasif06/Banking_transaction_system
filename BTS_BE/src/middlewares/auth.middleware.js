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
    // console.log("middleware error while verify auhorization", error);
    return res.status(401).json({
      message: "Unauthorized access,token is invalid",
      status: "failed",
    });
  }
};

export const authSystemUserMiddleware = async (req, res, next) => {
  try {
    // console.log(" authSystemUserMiddleware HIT");

    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1];

    // console.log("Token:", token);

    if (!token) {
      // console.log(" Token missing");
      return res.status(401).json({
        message: "Unauthorized access token is missing",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded:", decode);

    const user = await userModel
      .findById(decode.userId)
      .select("+systemUser");

    // console.log("User:", user);

    if (!user) {
      // console.log(" User not found");
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!user.systemUser) {
      // console.log("Not a system user");
      return res.status(403).json({
        message: "Forbidden access, not a system user",
      });
    }

    req.user = user;

    // console.log(" System user verified");
    next();   //  THIS WAS MISSING

  } catch (error) {
    // console.log("Middleware error:", error.message);
    return res.status(401).json({
      message: "Unauthorized access, token invalid",
    });
    // next(error)
  }
};




// export const authSystemUserMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         message: "Unauthorized access token is missing",
//       });
//     }
//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await userModel.findById(decode.userId).select("+systemUser");
//     if (!user.systemUser) {
//       return res.status(403).json({
//         message: "Forbidden access, not a system user",
//       });
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("middleware error while verify auhorization", error);
//     return res.status(401).json({
//       message: "Unauthorized access,token is invalid",
//       status: "failed",
//     });
//   }
// };
