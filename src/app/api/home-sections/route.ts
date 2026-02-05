import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import HomeSection from '@/lib/models/HomeSection';

export async function GET() {
    await connectToDatabase();
    try {
        const sections = await HomeSection.find({}).sort({ order: 1 }).populate('category');
        return NextResponse.json({ success: true, data: sections });
    } catch (error) {
        console.error('Error fetching home sections:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const section = await HomeSection.create(body);
        return NextResponse.json({ success: true, data: section }, { status: 201 });
    } catch (error) {
        console.error('Error creating home section:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
