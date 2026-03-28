import connectDB from "@/lib/mongodb";
import * as DepositModel from "@/models/Deposit";
import { requireAuth } from "@/middleware/authMiddleware";
import { notifyAdmins } from "@/lib/eventEmitter";
import { createAdminNotification } from "@/lib/createNotification";
import { saveImage } from "@/lib/uploadImage";

export async function POST(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const formData = await request.formData();
    const amountStr = formData.get("amount");
    const txHash = formData.get("txHash");
    const screenshotFile = formData.get("screenshot");

    const amount = parseFloat(amountStr);

    if (!amount || !txHash) {
      return Response.json(
        {
          success: false,
          message: "Amount and transaction hash are required.",
        },
        { status: 400 },
      );
    }

    if (isNaN(amount) || amount <= 0) {
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

    const existing = await DepositModel.default.findOne({
      txHash: txHash.trim(),
    });
    if (existing) {
      return Response.json(
        {
          success: false,
          message: "This transaction hash has already been submitted.",
        },
        { status: 409 },
      );
    }

    // Screenshot is REQUIRED
    if (!screenshotFile || screenshotFile.size === 0) {
      return Response.json(
        { success: false, message: "Screenshot proof is required." },
        { status: 400 },
      );
    }

    let screenshotUrl = null;
    let screenshotPublicId = null;
    const { url, publicId, error } = await saveImage(screenshotFile);
    if (error) {
      return Response.json({ success: false, message: error }, { status: 400 });
    }
    screenshotUrl = url;
    screenshotPublicId = publicId;

    const deposit = await DepositModel.default.create({
      userId: user.id,
      amount,
      txHash: txHash.trim(),
      status: "pending",
      screenshotUrl,
      screenshotPublicId,
      screenshotUploadedAt: screenshotUrl ? new Date() : null,
    });

    // ✅ Save persistent notification in DB for all admins (include screenshot info)
    await createAdminNotification({
      title: "New Deposit Request",
      message: `$${amount} deposit with screenshot proof. Review required.`,
      type: "new_deposit",
      metadata: {
        depositId: deposit._id,
        amount,
        txHash: txHash.trim(),
        screenshotUrl,
        hasScreenshot: !!screenshotUrl,
      },
    });

    // ✅ Also push real-time SSE to online admins
    notifyAdmins("new_deposit", {
      depositId: deposit._id,
      amount: deposit.amount,
      txHash: deposit.txHash,
      userId: user.id,
      screenshotUrl,
      hasScreenshot: !!screenshotUrl,
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

    const deposits = await DepositModel.default.find({ userId: user.id }).sort({
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
