import mongoose from "mongoose";
import { string } from "zod";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Account must be associated with a user"],
      index: true,
    },
    status: {
      type: string,
      enum: {
        values: ["active", "fronzen", "closed"],
        message: "Status can be either active, fronzen or closed",
      },
      default: "active",
    },
    currency: {
      type: String,
      required: [true, "Currency is required for creating an account"],
      default: "INR",
    },
  },
  { timestamps: true },
);
accountSchema.index({ user: 1, status: 1 });

const accountModel = mongoose.model("Account", accountSchema);
export default accountModel;
