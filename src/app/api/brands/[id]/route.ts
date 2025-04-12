import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Brand from "@/models/brand"; // Adjust the import path
import dbConnect from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try { 
    await dbConnect();
    const { id } = params;
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Brand deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ message: "Error deleting brand", error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const { name, description, image } = await req.json();
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, description, image },
      { new: true, runValidators: true }
    );
    if (!updatedBrand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }
    return NextResponse.json(updatedBrand, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating brand", error: (error as Error).message }, { status: 500 });
  }
}