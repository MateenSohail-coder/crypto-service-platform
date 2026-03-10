import connectDB from "@/lib/mongodb";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import { requireAdmin } from "@/middleware/authMiddleware";

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

    // Validate input
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

    // Find deposit
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

    // Update deposit status
    deposit.status = action;
    deposit.reviewedAt = new Date();
    deposit.reviewedBy = admin.id;
    await deposit.save();

    // If approved, increase user balance
    if (action === "approved") {
      const updatedUser = await User.findByIdAndUpdate(
        deposit.userId,
        { $inc: { balance: deposit.amount } },
        { new: true },
      );

      return Response.json(
        {
          success: true,
          message: `Deposit approved. $${deposit.amount} added to user balance.`,
          deposit,
          newBalance: updatedUser.balance,
        },
        { status: 200 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Deposit rejected successfully.",
        deposit,
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
