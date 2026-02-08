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
        const Category = (await import('@/lib/models/Category')).default;
        const Product = (await import('@/lib/models/Product')).default;

        const categories = await Category.find({}).lean();

        // Fetch product counts for each category
        const categoriesWithCounts = await Promise.all(categories.map(async (cat: any) => {
            const count = await Product.countDocuments({
                categories: cat._id
            });
            return {
                ...cat,
                _id: cat._id.toString(), // Explicitly stringify ID
                productCount: count
            };
        }));

        return NextResponse.json({ success: true, data: categoriesWithCounts });
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
