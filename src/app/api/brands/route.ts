import { NextRequest, NextResponse } from "next/server";
import Brand from "@/models/brand"; // Adjust the import path
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const brands = await Brand.find();
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching brands", error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { name, description, image } = await req.json();
    const newBrand = new Brand({ name, description, image });
    const savedBrand = await newBrand.save();
    return NextResponse.json(savedBrand, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching brands", error: (error as Error).message },
      { status: 500 },
    );
  }
}
