import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

// GET all projects
export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find().sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      projects,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch projects",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// CREATE a new project
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, description, color, status, dueDate } = body;

    if (!name || !name.trim()) {
      return Response.json(
        {
          success: false,
          message: "Project name is required",
        },
        { status: 400 }
      );
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      color,
      status,
      dueDate: dueDate || null,
    });

    return Response.json(
      {
        success: true,
        message: "Project created successfully",
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to create project",
        error: error.message,
      },
      { status: 500 }
    );
  }
}