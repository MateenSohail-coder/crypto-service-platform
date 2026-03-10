import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { success: false, message: "Email is already registered." },
        { status: 409 },
      );
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // Sign JWT
    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return Response.json(
      {
        success: true,
        message: "Registration successful.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          balance: user.balance,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
