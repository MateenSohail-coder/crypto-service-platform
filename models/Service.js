import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required."],
      trim: true,
      minlength: [1, "Name must be at least 1 character."],
      maxlength: [100, "Name cannot exceed 100 characters."],
    },

    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minlength: [10, "Description must be at least 10 characters."],
      maxlength: [1000, "Description cannot exceed 1000 characters."],
    },

    // Stores "/uploads/filename.jpg" — NOT base64
    image: {
      type: String,
      default: null,
    },

    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price cannot be negative."],
    },

    commissionRate: {
      type: Number,
      required: [true, "Commission rate is required."],
      min: [0, "Commission rate cannot be negative."],
      max: [100, "Commission rate cannot exceed 100%."],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
