import connectDB from "@/lib/mongodb";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";
import { requireAdmin } from "@/middleware/authMiddleware";
import { notifyUser, notifyAdmins } from "@/lib/eventEmitter";
import { createNotification } from "@/lib/createNotification";

export async function GET(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const withdrawals = await Withdrawal.find()
      .populate("userId", "name email balance")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, withdrawals }, { status: 200 });
  } catch (error) {
    console.error("Admin withdrawals fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { user: admin, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const body = await request.json();
    const { withdrawalId, action } = body;

    if (!withdrawalId || !action) {
      return Response.json(
        { success: false, message: "withdrawalId and action are required." },
        { status: 400 },
      );
    }

    if (!["approved", "rejected"].includes(action)) {
      return Response.json(
        { success: false, message: "Action must be 'approved' or 'rejected'." },
        { status: 400 },
      );
    }

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return Response.json(
        { success: false, message: "Withdrawal not found." },
        { status: 404 },
      );
    }

    if (withdrawal.status !== "pending") {
      return Response.json(
        {
          success: false,
          message: `Withdrawal has already been ${withdrawal.status}.`,
        },
        { status: 409 },
      );
    }

    withdrawal.status = action;
    withdrawal.reviewedAt = new Date();
    withdrawal.reviewedBy = admin.id;
    await withdrawal.save();

    let newBalance = null;

    if (action === "approved") {
      // ✅ RE-CHECK balance before deducting (funds could have changed)
      const updatedUser = await User.findById(withdrawal.userId);
      if (!updatedUser || updatedUser.balance < withdrawal.amount) {
        return Response.json(
          {
            success: false,
            message: `Insufficient balance for approval. Available: $${updatedUser?.balance?.toFixed(2) || 0}`,
          },
          { status: 400 },
        );
      }

      const finalUser = await User.findByIdAndUpdate(
        withdrawal.userId,
        { $inc: { balance: -withdrawal.amount } },  // Deduct on approval (mirror deposit add)
        { new: true },
      );
      newBalance = finalUser.balance;

      // ✅ Save persistent notification for the user (mirror deposit)
      await createNotification({
        userId: withdrawal.userId,
        title: "Withdrawal Approved 🎉",
        message: `Your withdrawal of $${withdrawal.amount} has been approved. Funds sent to your wallet. New balance: $${newBalance.toFixed(2)}.`,
        type: "withdrawal_approved",
        metadata: {
          withdrawalId: withdrawal._id,
          amount: withdrawal.amount,
          newBalance,
          walletAddress: withdrawal.walletAddress,
        },
      });

      // Real-time push if user is online (mirror deposit)
      notifyUser(withdrawal.userId.toString(), "withdrawal_approved", {
        withdrawalId: withdrawal._id,
        amount: withdrawal.amount,
        newBalance,
        message: `Your $${withdrawal.amount} withdrawal has been approved!`,
      });
    } else {
      // Rejected - mirror deposit rejected
      await createNotification({
        userId: withdrawal.userId,
        title: "Withdrawal Rejected",
        message: `Your withdrawal request of $${withdrawal.amount} has been rejected. Please contact support.`,
        type: "withdrawal_rejected",
        metadata: { withdrawalId: withdrawal._id, amount: withdrawal.amount },
      });

      notifyUser(withdrawal.userId.toString(), "withdrawal_rejected", {
        withdrawalId: withdrawal._id,
        amount: withdrawal.amount,
        message: `Your withdrawal request of $${withdrawal.amount} was rejected.`,
      });
    }

    // Notify all admins withdrawal list changed (mirror deposit)
    notifyAdmins("withdrawal_reviewed", {
      withdrawalId: withdrawal._id,
      action,
    });

    return Response.json(
      {
        success: true,
        message:
          action === "approved"
            ? `Withdrawal approved. $${withdrawal.amount} deducted from user balance.`
            : "Withdrawal rejected successfully.",
        withdrawal,
        newBalance,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Withdrawal approve error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

