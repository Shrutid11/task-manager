import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

// GET all tasks
export async function GET() {
  try {
    await connectDB();

    const tasks = await Task.find()
      .populate("project")
      .populate("category")
      .sort({ createdAt: -1 });

    return Response.json({
      success: true,
      tasks,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch tasks",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// CREATE a new task
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      category,
    } = body;

    if (!title || !title.trim()) {
      return Response.json(
        {
          success: false,
          message: "Task title is required",
        },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate: dueDate || null,
      project: project || null,
      category: category || null,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project")
      .populate("category");

    return Response.json(
      {
        success: true,
        message: "Task created successfully",
        task: populatedTask,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to create task",
        error: error.message,
      },
      { status: 500 }
    );
  }
}