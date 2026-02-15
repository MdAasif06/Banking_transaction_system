import accountModel from "../models/account.model.js";

export const createAccount = async (req, res, next) => {
  try {
    const user = req.user;

    const account = await accountModel.create({
      user: user._id,
    });
    res.status(200).json({
      message: "account created successfully",
      account,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAccount = async (req, res, next) => {
  try {
    const accounts = await accountModel.find({ user: req.user._id });
    if (accounts.length === 0) {
      return res.status(400).json({
        message: "user accounts is not available",
      });
    }
    res.status(200).json({
      message: "user accounts",
      accounts,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountBalance = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
      _id: accountId,
      user: req.user._id,
    });
    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }
    
    const balance = await account.getBalance();
    res.status(200).json({
      accountId: account._id,
      balance: balance,
    });
  } catch (error) {
    next(error);
  }
};

// export const getAccountBalance = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     console.log("AccountId:", id);
//     console.log("Logged User:", req.user);

//     const account = await accountModel.findOne({
//       _id: id,
//       user: req.user._id,
//     });

//     console.log("Account Found:", account);

//     if (!account) {
//       return res.status(404).json({
//         message: "Account not found",
//       });
//     }

//     const balance = await account.getBalance();

//     res.status(200).json({
//       accountId: account._id,
//       balance,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
