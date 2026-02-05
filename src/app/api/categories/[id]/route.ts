import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Category from '@/lib/models/Category';
import fs from 'fs';
import path from 'path';

function logToDisk(message: string, data: any) {
    const logPath = path.join(process.cwd(), 'category_api.log');
    const logEntry = `${new Date().toISOString()} - ${message}\n${JSON.stringify(data, null, 2)}\n\n`;
    fs.appendFileSync(logPath, logEntry);
}

// GET: Fetch a single category by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15+ async params
) {
    const { id } = await params;
    await connectToDatabase();
    try {
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch category' }, { status: 400 });
    }
}

// PUT: Update a category by ID
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectToDatabase();
    try {
        const body = await request.json();
        logToDisk(`PUT - Updating ${id}`, body);

        // Log schema paths to verify if 'parent' exists
        logToDisk(`PUT - Schema Paths`, Object.keys(Category.schema.paths));

        const updateData: any = { ...body };
        // Ensure parent is null if empty string
        if (updateData.parent === "") updateData.parent = null;

        const category = await Category.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        logToDisk(`PUT - Updated result ${id}`, category);
        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 400 });
    }
}

// DELETE: Remove a category by ID
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectToDatabase();
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 400 });
    }
}
