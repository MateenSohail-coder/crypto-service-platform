import connectDB from "@/lib/mongodb";
import Deposit from "@/models/Deposit";
import { requireAuth } from "@/middleware/authMiddleware";
import { notifyAdmins } from "@/lib/eventEmitter";
import { createAdminNotification } from "@/lib/createNotification";

export async function POST(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const body = await request.json();
    const { amount, txHash } = body;

    if (!amount || !txHash) {
      return Response.json(
        {
          success: false,
          message: "Amount and transaction hash are required.",
        },
        { status: 400 },
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return Response.json(
        { success: false, message: "Amount must be a positive number." },
        { status: 400 },
      );
    }

    if (txHash.trim().length < 10) {
      return Response.json(
        { success: false, message: "Invalid transaction hash." },
        { status: 400 },
      );
    }

    const existing = await Deposit.findOne({ txHash: txHash.trim() });
    if (existing) {
      return Response.json(
        {
          success: false,
          message: "This transaction hash has already been submitted.",
        },
        { status: 409 },
      );
    }

    const deposit = await Deposit.create({
      userId: user.id,
      amount,
      txHash: txHash.trim(),
      status: "pending",
    });

    // ✅ Save persistent notification in DB for all admins
    await createAdminNotification({
      title: "New Deposit Request",
      message: `A user submitted a deposit of $${amount}. Review required.`,
      type: "new_deposit",
      metadata: { depositId: deposit._id, amount, txHash: txHash.trim() },
    });

    // ✅ Also push real-time SSE to online admins
    notifyAdmins("new_deposit", {
      depositId: deposit._id,
      amount: deposit.amount,
      txHash: deposit.txHash,
      userId: user.id,
    });

    return Response.json(
      {
        success: true,
        message: "Deposit submitted successfully. Awaiting admin approval.",
        deposit,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Deposit create error:", error);
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

    const deposits = await Deposit.find({ userId: user.id }).sort({
      createdAt: -1,
    });

    return Response.json({ success: true, deposits }, { status: 200 });
  } catch (error) {
    console.error("Deposit fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
