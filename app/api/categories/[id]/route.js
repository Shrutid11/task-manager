import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

// GET a single category
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return Response.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      category,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// UPDATE a category
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

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

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        color,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return Response.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE a category
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return Response.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to delete category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}