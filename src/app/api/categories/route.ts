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

export async function GET() {
    await connectToDatabase();
    try {
        const categories = await Category.find({});
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await connectToDatabase();
    try {
        const body = await request.json();
        logToDisk('POST - Incoming body', body);
        const category = await Category.create(body);
        logToDisk('POST - Created category', category);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
