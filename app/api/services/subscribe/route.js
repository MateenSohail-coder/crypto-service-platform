import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Service from "@/models/Service";
import Subscription from "@/models/Subscription";
import { requireAuth } from "@/middleware/authMiddleware";
import { calculateCommission } from "@/utils/calculateCommission";

const MAX_SUBSCRIPTIONS_PER_DAY = 24;

export async function POST(request) {
  try {
    const { user: authUser, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const body = await request.json();
    const { serviceId } = body;

    if (!serviceId) {
      return Response.json(
        { success: false, message: "serviceId is required." },
        { status: 400 },
      );
    }

    // Fetch fresh user from DB
    const user = await User.findById(authUser.id);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    // Fetch service
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return Response.json(
        { success: false, message: "Service not found or inactive." },
        { status: 404 },
      );
    }

    // Check daily subscription limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastSubDate = user.lastSubscriptionDate
      ? new Date(user.lastSubscriptionDate)
      : null;

    if (lastSubDate && lastSubDate >= today) {
      // Same day — check count
      if (user.subscriptionsToday >= MAX_SUBSCRIPTIONS_PER_DAY) {
        return Response.json(
          {
            success: false,
            message: `You have reached the maximum of ${MAX_SUBSCRIPTIONS_PER_DAY} subscriptions for today.`,
          },
          { status: 429 },
        );
      }
    } else {
      // New day — reset count
      user.subscriptionsToday = 0;
    }

    // Check user balance
    if (user.balance < service.price) {
      return Response.json(
        {
          success: false,
          message: `Insufficient balance. You need $${service.price} but have $${user.balance}.`,
        },
        { status: 400 },
      );
    }

    // Calculate commission and total return
    const { commission, total } = calculateCommission(
      service.price,
      service.commissionRate,
    );

    const balanceBefore = user.balance;
    const balanceAfter = parseFloat(
      (user.balance - service.price + total).toFixed(2),
    );

    // Update user balance and subscription tracking
    user.balance = balanceAfter;
    user.subscriptionsToday += 1;
    user.lastSubscriptionDate = new Date();
    await user.save();

    // Log subscription
    const subscription = await Subscription.create({
      userId: user._id,
      serviceId: service._id,
      serviceName: service.name,
      price: service.price,
      commissionRate: service.commissionRate,
      commissionEarned: commission,
      totalReturned: total,
      balanceBefore,
      balanceAfter,
    });

    return Response.json(
      {
        success: true,
        message: `Subscribed to "${service.name}" successfully.`,
        subscription,
        balanceBefore,
        balanceAfter,
        commissionEarned: commission,
        subscriptionsToday: user.subscriptionsToday,
        remainingToday: MAX_SUBSCRIPTIONS_PER_DAY - user.subscriptionsToday,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

// GET - fetch current user's subscriptions
export async function GET(request) {
  try {
    const { user: authUser, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const subscriptions = await Subscription.find({ userId: authUser.id })
      .populate("serviceId", "name price commissionRate")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, subscriptions }, { status: 200 });
  } catch (error) {
    console.error("Subscriptions fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
