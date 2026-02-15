// /**
//  * create a new transaction
//  * The 10-step transfer flow:
//    1.Validate request
//    2.Validate idempotency key
//    3.Check account status
//    4.Derive sender balance from ledger
//    5.Create transaction (PENDING)
//    6.Create DEBIT ledger entry
//    7.Create CREDIT Ledger entry
//    8.Mark transaction COMPLETED
//    9.Commit MongoDB session
//    10.Send email notification
//  */
import transactionModel from "../models/transaction.model.js";
import accountModel from "../models/account.model.js";
import ledgerModel from "../models/ledger.model.js";
import mongoose from "mongoose";
import { sendTransactionEmail } from "../utils/sendEmail.js";

export const createTransaction = async (req, res) => {
  let session; // 👈 yaha declare karo
  try {
    console.log("STEP 1: Request received");
    // 1.Validate request
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    console.log("STEP 2: Body validated");
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message: "All fields are required",
        status: "failed",
      });
    }
    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    console.log("STEP 3: Accounts fetched");

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
        return res.status(500).json({
          message: "Transaction was reversed ,please retry",
        });
      }
    }
    //    3.Check account status
    if (
      fromUserAccount.status !== "active" ||
      toUserAccount.status !== "active"
    ) {
      return res.status(400).json({
        message:
          "fromAccount and toAccount must be active to process transaction",
      });
    }

    //   4.Derive sender balance from ledger
    const balance = await fromUserAccount.getBalance();
    console.log("STEP 4: Balance fetched:", balance);
    if (balance < amount) {
      return res.status(400).json({
        message: `Insufficent balance, Current balance is ${balance} Request amount is ${amount} `,
      });
    }

    //  5.Create transaction (PENDING)
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log("STEP 5: Transaction started");

    const transaction = new transactionModel(
      {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "pending",
      },
      /////////// { session },
    );
    console.log("STEP 6: Transaction created");

    // 6.Create DEBIT ledger entry
    await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "debit",
        },
      ],
      { session },
    );
    console.log("STEP 7: Debit entry done");
    //  7.Create CREDIT Ledger entry
    await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "credit",
        },
      ],
      { session },
    );
    console.log("STEP 8: Credit entry done");
    // 8.Mark transaction COMPLETED
    transaction.status = "completed";
    await transaction.save({ session });

    // 9.Commit MongoDB session
    await session.commitTransaction();
    session.endSession();
    console.log("STEP 9: Transaction committed");
    console.log("STEP 10: Sending email...");
    //  10.Send email notification
    await sendTransactionEmail(
      req.user.email,
      req.user.username,
      amount,
      toAccount,
    );
    console.log("STEP 11: Email sent");
    return res.status(201).json({
      message: "Transaction completed successfull",
      transaction: transaction,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return res.status(500).json({
      message: "Transaction failed",
      error: error.message,
    });
  }
};

export const createInitialFoundsTransaction = async (req, res, next) => {
  let session;
  try {
    // console.log("STEP 1: Request received v2");
    const { toAccount, amount, idempotencyKey } = req.body;
    if (!toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message: "toAccount , amount and idempotentcyKey are required",
      });
    }
    // console.log("STEP 2: Checking duplicate transaction v2");
    const existingTransaction = await transactionModel.findOne({
      idempotencyKey,
    });
    // console.log("STEP 3: Fetching toAccount v2");
    const toUserAccount = await accountModel.findOne({
      _id: toAccount,
    });
    if (!toUserAccount) {
      return res.status(400).json({
        message: "Invalid account",
      });
    }
    const fromUserAccount = await accountModel.findOne({
      user: req.user._id,
    });
    if (!fromUserAccount) {
      return res.status(400).json({
        message: "system account is not found",
      });
    }
    // console.log("STEP 4: Starting session v2");
    session = await mongoose.startSession();
    session.startTransaction();
    // console.log("STEP 5: Creating transaction v2");
    if (existingTransaction) {
      return res.status(409).json({
        message: "Duplicate transaction request",
      });
    }

    const transaction = new transactionModel({
      fromAccount: fromUserAccount._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "pending",
    });
    await transaction.save({ session });
    // console.log("STEP 6: Creating debit entry v2");
    const debitLEdgerEntry = await ledgerModel.create(
      [
        {
          account: fromUserAccount._id,
          amount: amount,
          transaction: transaction._id,
          type: "debit",
        },
      ],
      { session },
    );
    // console.log("STEP 7: Creating credit entry v2");
    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "credit",
        },
      ],
      { session },
    );
    // console.log("STEP 8: Marking completed v2");
    transaction.status = "completed";
    await transaction.save({ session });
    // console.log("STEP 9: Committing v2");
    await session.commitTransaction();
    session.endSession();
    //  console.log("STEP:10 suceescc")
    return res.status(201).json({
      message: "Initial funds transaction completed successfully",
      transaction: transaction,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    // console.log("STEP 11: catch block found error");
    console.log(" Transaction failed:", error.message);
    next(error); //  use next here instead of res.status
  }
};
