import mongoose from "mongoose";
import ledgerModel from "./ledger.model.js";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Account must be associated with a user"],
      index: true,
    },
    status: {
      type: String,
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


accountSchema.methods.getBalance = async function () {
  const balanceData = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0],
          },
          totalCredit: {
            $sum: {
              $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0],
            },
          },
          $ptoject: {
            _id: 0,
            balance: { $subtract: ["$totalCredit", "$totalDebit"] },
          },
        },
      },
    },
  ]);

  if (balanceData.length === 0) {
    return 0;
  }
  return balanceData[0].balance;
};
