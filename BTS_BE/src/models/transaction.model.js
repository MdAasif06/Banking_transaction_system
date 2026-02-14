import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a from account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a to account"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed", "failed", "reversed"],
        message: "Status must be pending, completed, failed or reversed",
      },
      default: "pending",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for creating a transaction"],
      min: [1, "Transaction amount can not be negative"],
    },
    idempotencyKey: {
      type: String,
      required: [
        true,
        "idempotency key is required for creating a transaction",
      ],
      index: true,
      unique: true,
    },
  },
  { timestamps: true },
);
transactionSchema.pre("validate", function () {
  if (
    this.fromAccount &&
    this.toAccount &&
    this.fromAccount.toString() === this.toAccount.toString()
  ) {
    throw new Error("Cannot transfer to same account");
  }
});


const transactionModel = mongoose.model("Transaction", transactionSchema);
export default transactionModel;
