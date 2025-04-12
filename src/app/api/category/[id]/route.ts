import dbConnect from "@/lib/db";
import Category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest, {params} : {params : {id:string}}) {
    try {
        await dbConnect();
        const { id } = params;
        const deleteCategory = await Category.findByIdAndDelete(id);
        if(!deleteCategory) {
             return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting category", error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(req:NextRequest, {params} : {params : {id:string}}) {
   try {
    await dbConnect();
    const { id }  = params;
    const { name, description } = await req.json();
    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { name, description },
        { new:true, runValidators:true }
    );

    if(!updatedCategory) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Category updated successfully" }, { status: 200 });
   } catch (error) {
    return NextResponse.json({ message: "Error updating category", error: (error as Error).message }, { status: 500 });
   }

}