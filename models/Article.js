import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [3, "Title must be at least 3 characters."],
      maxlength: [200, "Title cannot exceed 200 characters."],
    },

    content: {
      type: String,
      required: [true, "Content is required."],
      trim: true,
      minlength: [10, "Content must be at least 10 characters."],
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters."],
      default: "",
    },

    // Cloudinary image data
    coverImageUrl: {
      type: String,
      default: null,
    },
    coverImagePublicId: {
      type: String,
      default: null,
    },

    isPublished: {
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

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);
