import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Withdrawal from "@/models/Withdrawal";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  await connectDB();

  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const withdrawals = await Withdrawal.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    console.error("GET /api/withdrawals error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
