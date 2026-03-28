import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Withdrawal amount is required"],
      min: [10, "Amount must be at least $10"],  // Reasonable minimum
    },
    walletAddress: {
      type: String,
      required: [true, "Wallet address is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// 🚀 PRODUCTION INDEXES - Prevent duplicates + speed up queries (mirror Deposit)
WithdrawalSchema.index({ walletAddress: 1 }, { unique: true });  // Prevent duplicate withdrawals
WithdrawalSchema.index({ userId: 1, createdAt: -1 });           // Fast user withdrawal history
WithdrawalSchema.index({ status: 1, reviewedAt: -1 });           // Fast admin pending queue

const Withdrawal = mongoose.models.Withdrawal || mongoose.model("Withdrawal", WithdrawalSchema);

export default Withdrawal;

