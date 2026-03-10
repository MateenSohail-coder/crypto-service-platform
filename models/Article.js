import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Article content is required"],
    },
    excerpt: {
      type: String,
      trim: true,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Article =
  mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default Article;
