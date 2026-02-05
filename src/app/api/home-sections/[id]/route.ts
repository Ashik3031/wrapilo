import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import HomeSection from '@/lib/models/HomeSection';

// GET: Fetch a single section by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectToDatabase();
    try {
        const section = await HomeSection.findById(id).populate('category');
        if (!section) {
            return NextResponse.json({ success: false, error: 'Section not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: section });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch section' }, { status: 400 });
    }
}

// PUT: Update a section by ID
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectToDatabase();
    try {
        const body = await request.json();
        const section = await HomeSection.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!section) {
            return NextResponse.json({ success: false, error: 'Section not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: section });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update section' }, { status: 400 });
    }
}

// DELETE: Remove a section by ID
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectToDatabase();
    try {
        const section = await HomeSection.findByIdAndDelete(id);
        if (!section) {
            return NextResponse.json({ success: false, error: 'Section not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete section' }, { status: 400 });
    }
}
