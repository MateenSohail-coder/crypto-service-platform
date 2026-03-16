import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import { requireAuth, requireAdmin } from "@/middleware/authMiddleware";
import { saveImage, deleteImage } from "@/lib/uploadImage";

// GET — published articles (authenticated users)
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

// POST — create article (admin)
export async function POST(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const formData = await request.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const excerpt = formData.get("excerpt") || "";
    const imageFile = formData.get("coverImage");

    if (!title || !content) {
      return Response.json(
        { success: false, message: "Title and content are required." },
        { status: 400 },
      );
    }

    const { url: coverImageUrl, error: imageError } =
      await saveImage(imageFile);
    if (imageError) {
      return Response.json(
        { success: false, message: imageError },
        { status: 400 },
      );
    }

    const article = await Article.create({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.substring(0, 120) + "...",
      coverImage: coverImageUrl, // "/uploads/filename.jpg" or null
      createdBy: user.id,
      isPublished: true,
    });

    return Response.json(
      { success: true, message: "Article published successfully.", article },
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

// DELETE — delete article (admin)
export async function DELETE(request) {
  try {
    const { user, response } = await requireAdmin(request);
    if (response) return response;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "Article ID is required." },
        { status: 400 },
      );
    }

    const article = await Article.findById(id);
    if (!article) {
      return Response.json(
        { success: false, message: "Article not found." },
        { status: 404 },
      );
    }

    // Delete image file from VPS disk
    deleteImage(article.coverImage);

    await Article.findByIdAndDelete(id);

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
