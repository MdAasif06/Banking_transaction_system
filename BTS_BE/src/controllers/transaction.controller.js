/**
 * create a new transaction
 * The 10-step transfer flow:
   1.Validate request
   2.Validate idempotency key
   3.Check account status
   4.Derive sender balance from ledger
   5.Create transaction (PENDING)
   6.Create DEBIT ledger entry
   7.Create CREDIT Ledger entry
   8.Mark transaction COMPLETED
   9.Commit MongoDB session
   10.Send email notification
 */
import transactionModel from "../models/transaction.model.js";
import accountModel from "../models/account.model.js";
import ledgerModel from "../models/ledger.model.js";
import mongoose from "mongoose";
import { sendTransactionEmail } from "../utils/sendEmail.js";

export const createTransaction = async (req, res, next) => {
  try {
    // 1.Validate request
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message: "All fields are required",
        status: "failed",
      });
    }
    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!fromUserAccount || !toUserAccount) {
      return res.status(400).json({
        message: "Invalid fromAccount or toAccount",
      });
    }
    //    2.Validate idempotency key
    const isTransactionAlreadyExists = await transactionModel.findOne({
      idempotencyKey: idempotencyKey,
    });
    if (isTransactionAlreadyExists) {
      if (isTransactionAlreadyExists.status === "completed") {
        return res.status(200).json({
          message: "Transaction already processed",
          transaction: isTransactionAlreadyExists,
        });
      }
      if (isTransactionAlreadyExists.status === "pending") {
        return res.status(200).json({
          message: "Transaction is still processing",
        });
      }
      if (isTransactionAlreadyExists.status === "failed") {
        return res.status(400).json({
          message: "transaction processing failed previously,please retry",
          status: "failed",
        });
      }
      if (isTransactionAlreadyExists.status === "reversed") {
        return res.staus(500).json({
          message: "Transaction was reversed ,please retry",
        });
      }
    }
    //    3.Check account status
    if (
      fromUserAccount.status !== "active" &&
      toUserAccount.status !== "active"
    ) {
      return res.status(400).json({
        message:
          "fromAccount and toAccount must be active to process transaction",
      });
    }

    //   4.Derive sender balance from ledger
    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
      return res.status(400).json({
        message: `Insufficent balance, Current balance is ${balance} Request amount is ${amount} `,
      });
    }

    //  5.Create transaction (PENDING)
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.create(
      {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "pending ",
      },
      { session },
    );

    // 6.Create DEBIT ledger entry
    const debitLEdgerEntry = await ledgerModel.create(
      {
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "debit",
      },
      { session },
    );

    //  7.Create CREDIT Ledger entry
    const creditLedgerEntry = await ledgerModel.create(
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "credit",
      },
      { session },
    );
    // 8.Mark transaction COMPLETED
    transaction.status = "completed";
    await transaction.save({ session });

    // 9.Commit MongoDB session
    await session.commitTransaction();
    session.endSession();

    //  10.Send email notification
    await sendTransactionEmail(
      req.user.email,
      req.user.username,
      amount,
      toAccount,
    );
    return res.status(201).json({
      message: "Transaction completed successfull",
      transaction: transaction,
    });
  } catch (error) {
    next();
  }
};
