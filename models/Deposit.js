import mongoose from "mongoose";

const DepositSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Deposit amount is required"],
      min: [1, "Amount must be at least 1"],
    },
    txHash: {
      type: String,
      required: [true, "Transaction hash is required"],
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

// 🚀 PRODUCTION INDEXES - Prevent duplicates + speed up queries
DepositSchema.index({ txHash: 1 }, { unique: true });  // Prevent duplicate deposits
DepositSchema.index({ userId: 1, createdAt: -1 });     // Fast user deposit history
DepositSchema.index({ status: 1, reviewedAt: -1 });     // Fast admin pending queue

const Deposit = mongoose.models.Deposit || mongoose.model("Deposit", DepositSchema);

export default Deposit;

