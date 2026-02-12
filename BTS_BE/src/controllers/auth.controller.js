import userModel from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(404)
        .json({ message: "All fields are required", status: "failed" });
    }
    const isExists = await userModel.findOne({ email });
    if (isExists) {
      return res
        .status(400)
        .json({ message: "user already exits", status: "failed" });
    }

    const user = await userModel.create({
      email,
      password,
      username,
    });
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "user register successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(); //// global error middleware handle karega
  }
};
