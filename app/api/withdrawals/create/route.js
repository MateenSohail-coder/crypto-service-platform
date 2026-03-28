import connectDB from "@/lib/mongodb";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";
import { requireAuth } from "@/middleware/authMiddleware";
import { notifyAdmins } from "@/lib/eventEmitter";
import { createAdminNotification } from "@/lib/createNotification";

export async function POST(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const body = await request.json();
    const { amount, walletAddress } = body;

    if (!amount || !walletAddress) {
      return Response.json(
        {
          success: false,
          message: "Amount and wallet address are required.",
        },
        { status: 400 },
      );
    }

    if (typeof amount !== "number" || amount < 10) {
      return Response.json(
        { success: false, message: "Amount must be at least $10." },
        { status: 400 },
      );
    }

    if (walletAddress.trim().length < 26) {  // Basic crypto address length check
      return Response.json(
        { success: false, message: "Invalid wallet address format." },
        { status: 400 },
      );
    }

    // ✅ Check sufficient balance BEFORE creating request
    const userDoc = await User.findById(user.id);
    if (!userDoc || userDoc.balance < amount) {
      return Response.json(
        {
          success: false,
          message: `Insufficient balance. Available: $${userDoc?.balance?.toFixed(2) || 0}, Required: $${amount.toFixed(2)}`,
        },
        { status: 400 },
      );
    }

    const existing = await Withdrawal.findOne({ walletAddress: walletAddress.trim() });
    if (existing) {
      return Response.json(
        {
          success: false,
          message: "This wallet address has already been submitted for withdrawal.",
        },
        { status: 409 },
      );
    }

    const withdrawal = await Withdrawal.create({
      userId: user.id,
      amount,
      walletAddress: walletAddress.trim(),
      status: "pending",
    });

    // ✅ Save persistent notification in DB for all admins (mirror deposit)
    await createAdminNotification({
      title: "New Withdrawal Request",
      message: `A user requested $${amount} withdrawal. Review required.`,
      type: "new_withdrawal",
      metadata: { withdrawalId: withdrawal._id, amount, walletAddress: walletAddress.trim() },
    });

    // ✅ Also push real-time SSE to online admins (mirror deposit)
    notifyAdmins("new_withdrawal", {
      withdrawalId: withdrawal._id,
      amount: withdrawal.amount,
      walletAddress: withdrawal.walletAddress,
      userId: user.id,
    });

    return Response.json(
      {
        success: true,
        message: "Withdrawal request submitted successfully. Awaiting admin approval.",
        withdrawal,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Withdrawal create error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const withdrawals = await Withdrawal.find({ userId: user.id }).sort({
      createdAt: -1,
    });

    return Response.json({ success: true, withdrawals }, { status: 200 });
  } catch (error) {
    console.error("Withdrawal fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

