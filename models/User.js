import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    balance: {
      type: Number,
      default: 0,
    },
    subscriptionsToday: {
      type: Number,
      default: 0,
    },
    lastSubscriptionDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// 🚀 PRODUCTION INDEXES - Fast auth + admin dashboard
UserSchema.index({ email: 1 }, { unique: true });           // Login speedup
UserSchema.index({ role: 1, createdAt: -1 });              // Admin user list

// ✅ Fixed: no next() needed with async pre-save in ES modules
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
