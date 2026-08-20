import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

// ==========================================
// UPDATE PROJECT
// ==========================================

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const {
      name,
      description,
    } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          error: "Project name is required",
        },
        {
          status: 400,
        }
      );
    }

    const project =
      await Project.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          description:
            description?.trim() || "",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      project,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "UPDATE PROJECT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to update project",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// DELETE PROJECT
// ==========================================

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const project =
      await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Project deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE PROJECT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to delete project",
      },
      {
        status: 500,
      }
    );
  }
}