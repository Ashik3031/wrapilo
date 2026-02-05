import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/lib/models/Product';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectToDatabase();

    try {
        const product = await Product.findById(id).populate('category');
        if (!product) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectToDatabase();

    try {
        const body = await request.json();
        const product = await Product.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectToDatabase();

    try {
        const deletedProduct = await Product.deleteOne({ _id: id });
        if (!deletedProduct) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}
