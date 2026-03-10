import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import { requireAuth, requireAdmin } from "@/middleware/authMiddleware";

// GET - all published articles
export async function GET(request) {
  try {
    const { user, response } = await requireAuth(request);
    if (response) return response;

    await connectDB();

    const articles = await Article.find({ isPublished: true })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, articles }, { status: 200 });
  } catch (error) {
    console.error("Articles fetch error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

// POST - create article (admin only)
export async function POST(request) {
  try {
    const { user: admin, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const body = await request.json();
    const { title, content, excerpt, coverImage, isPublished } = body;

    if (!title || !content) {
      return Response.json(
        { success: false, message: "Title and content are required." },
        { status: 400 },
      );
    }

    const article = await Article.create({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      coverImage: coverImage || "",
      isPublished: isPublished !== undefined ? isPublished : true,
      createdBy: admin.id,
    });

    return Response.json(
      { success: true, message: "Article created successfully.", article },
      { status: 201 },
    );
  } catch (error) {
    console.error("Article create error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

// DELETE - delete article (admin only)
export async function DELETE(request) {
  try {
    const { user: admin, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("id");

    if (!articleId) {
      return Response.json(
        { success: false, message: "Article ID is required." },
        { status: 400 },
      );
    }

    const article = await Article.findByIdAndDelete(articleId);
    if (!article) {
      return Response.json(
        { success: false, message: "Article not found." },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, message: "Article deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Article delete error:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
