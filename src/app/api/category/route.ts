import dbConnect from "@/lib/db";
import Category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const cat = await Category.find();
        return NextResponse.json(cat);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching category", error: (error as Error).message }, { status: 500 });
        
    }
}

export async function POST(req:NextRequest){
    try {
        await dbConnect();
        const { name, description } =  await req.json();
        const newCategory = new Category({ name, description});
        const savedCategory = await newCategory.save();
        return NextResponse.json(savedCategory, { status : 201 })
    } catch (error) {
        return NextResponse.json({ message: "Error fetching category", error: (error as Error).message }, { status: 500 });
        
    }

}