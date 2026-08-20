import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

// ==========================================
// GET SINGLE TASK
// ==========================================

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const task = await Task.findById(id)
      .populate("project")
      .populate("category");

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(task, {
      status: 200,
    });
  } catch (error) {
    console.error("GET TASK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to fetch task",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// UPDATE TASK
// ==========================================

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    // ==========================================
    // FIND EXISTING TASK
    // ==========================================

    const existingTask =
      await Task.findById(id);

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // MERGE EXISTING DATA WITH NEW DATA
    // ==========================================

    const title =
      body.title !== undefined
        ? String(body.title).trim()
        : existingTask.title;

    const description =
      body.description !== undefined
        ? body.description
        : existingTask.description;

    const status =
      body.status !== undefined
        ? body.status
        : existingTask.status;

    const priority =
      body.priority !== undefined
        ? body.priority
        : existingTask.priority;

    const project =
      body.project !== undefined
        ? body.project || null
        : existingTask.project;

    const category =
      body.category !== undefined
        ? body.category || null
        : existingTask.category;

    // ==========================================
    // FIX DUE DATE
    // Convert YYYY-MM-DD into JavaScript Date
    // ==========================================

    let dueDate = existingTask.dueDate;

    if (body.dueDate !== undefined) {
      dueDate = body.dueDate
        ? new Date(
            `${body.dueDate}T00:00:00.000Z`
          )
        : null;
    }

    // ==========================================
    // VALIDATE DATE
    // ==========================================

    if (
      dueDate &&
      Number.isNaN(new Date(dueDate).getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid due date",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VALIDATE TITLE
    // ==========================================

    if (!title || !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Task title is required",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // UPDATE DATA
    // ==========================================

    const updateData = {
      title,
      description,
      status,
      priority,
      project,
      category,
      dueDate,
    };

    // ==========================================
    // HANDLE COMPLETED DATE
    // ==========================================

    if (status === "completed") {
      updateData.completedAt =
        existingTask.status === "completed" &&
        existingTask.completedAt
          ? existingTask.completedAt
          : new Date();
    } else {
      updateData.completedAt = null;
    }

    // ==========================================
    // UPDATE TASK
    // ==========================================

    const updatedTask =
      await Task.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("project")
        .populate("category");

    return NextResponse.json(
      {
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "UPDATE TASK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to update task",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// DELETE TASK
// ==========================================

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const task =
      await Task.findByIdAndDelete(id);

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Task deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE TASK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to delete task",
      },
      {
        status: 500,
      }
    );
  }
}