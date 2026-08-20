import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

// GET all categories
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      categories,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// CREATE a new category
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, color, description } = body;

    if (!name || !name.trim()) {
      return Response.json(
        {
          success: false,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name: name.trim(),
      color,
      description,
    });

    return Response.json(
      {
        success: true,
        message: "Category created successfully",
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to create category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}