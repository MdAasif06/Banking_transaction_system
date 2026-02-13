import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating a user"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address",
      ],
      unique: [true, "Email already exists"],
    },
    username: {
      type: String,
      required: [true, "username is required for creating a acocunt"],
    },
    password: {
      type: String,
      required: [true, "password is required for creating a account"],
      minlength: [6, "password shound be contain more than 6 character"],
      select: false,
    },
    systemUser:{
      type:Boolean,
      default:false,
      immutable:true,
      select:false
    }
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
   this.password = await bcrypt.hash(this.password, 10);
//   this.password = hashPassword;
  return 
});



userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const userModel = mongoose.model("User", userSchema);
export default userModel;
