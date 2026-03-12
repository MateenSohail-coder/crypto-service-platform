import connectDB from "@/lib/mongodb";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import { requireAdmin } from "@/middleware/authMiddleware";
import { notifyUser, notifyAdmins } from "@/lib/eventEmitter";
import { createNotification } from "@/lib/createNotification";

export async function GET(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const deposits = await Deposit.find()
      .populate("userId", "name email balance")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, deposits }, { status: 200 });
  } catch (error) {
    console.error("Admin deposits fetch error:", error);
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
    const { depositId, action } = body;

    if (!depositId || !action) {
      return Response.json(
        { success: false, message: "depositId and action are required." },
        { status: 400 },
      );
    }

    if (!["approved", "rejected"].includes(action)) {
      return Response.json(
        { success: false, message: "Action must be 'approved' or 'rejected'." },
        { status: 400 },
      );
    }

    const deposit = await Deposit.findById(depositId);
    if (!deposit) {
      return Response.json(
        { success: false, message: "Deposit not found." },
        { status: 404 },
      );
    }

    if (deposit.status !== "pending") {
      return Response.json(
        {
          success: false,
          message: `Deposit has already been ${deposit.status}.`,
        },
        { status: 409 },
      );
    }

    deposit.status = action;
    deposit.reviewedAt = new Date();
    deposit.reviewedBy = admin.id;
    await deposit.save();

    let newBalance = null;

    if (action === "approved") {
      const updatedUser = await User.findByIdAndUpdate(
        deposit.userId,
        { $inc: { balance: deposit.amount } },
        { new: true },
      );
      newBalance = updatedUser.balance;

      // ✅ Save persistent notification for the user
      await createNotification({
        userId: deposit.userId,
        title: "Deposit Approved 🎉",
        message: `Your deposit of $${deposit.amount} has been approved. Your new balance is $${newBalance.toFixed(2)}.`,
        type: "deposit_approved",
        metadata: {
          depositId: deposit._id,
          amount: deposit.amount,
          newBalance,
        },
      });

      // Real-time push if user is online
      notifyUser(deposit.userId.toString(), "deposit_approved", {
        depositId: deposit._id,
        amount: deposit.amount,
        newBalance,
        message: `Your deposit of $${deposit.amount} has been approved!`,
      });
    } else {
      // ✅ Save persistent notification for the user
      await createNotification({
        userId: deposit.userId,
        title: "Deposit Rejected",
        message: `Your deposit of $${deposit.amount} has been rejected. Please contact support if you think this is a mistake.`,
        type: "deposit_rejected",
        metadata: { depositId: deposit._id, amount: deposit.amount },
      });

      notifyUser(deposit.userId.toString(), "deposit_rejected", {
        depositId: deposit._id,
        amount: deposit.amount,
        message: `Your deposit of $${deposit.amount} was rejected.`,
      });
    }

    // Notify all admins deposit list changed
    notifyAdmins("deposit_reviewed", {
      depositId: deposit._id,
      action,
    });

    return Response.json(
      {
        success: true,
        message:
          action === "approved"
            ? `Deposit approved. $${deposit.amount} added to user balance.`
            : "Deposit rejected successfully.",
        deposit,
        newBalance,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Deposit approve error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
