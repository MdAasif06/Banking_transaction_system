import mongoose from "mongoose";

const tokenBlackListedSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to blackList"],
      unique: [true, "Token is already black listed"],
    },
  },
  { timestamps: true },
);
// TTL Index (3 days expiry)
(tokenBlackListedSchema.index({ createdAt: 1 }),
  {
    expireAfterSeconds: 60 * 60 * 24 * 3, //3days
  });

const tokenBlackListModel = mongoose.model(
  "tokenBlackList",
  tokenBlackListedSchema,
);

export default tokenBlackListModel;
