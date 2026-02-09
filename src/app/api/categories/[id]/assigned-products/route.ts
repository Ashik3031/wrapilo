import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectToDatabase();
    try {
        const Product = (await import('@/lib/models/Product')).default;
        const { id } = await params;

        console.log(`[API] Fetching assigned products for category: ${id}`);

        // Find products that have this category ID in their categories array
        const products = await Product.find({
            categories: id
        }).select('_id');

        return NextResponse.json({
            success: true,
            data: products.map(p => p._id.toString())
        });
    } catch (error: any) {
        console.error(`[API ERROR] GET assigned-products:`, error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectToDatabase();
    try {
        const Product = (await import('@/lib/models/Product')).default;
        const Category = (await import('@/lib/models/Category')).default;
        const { id } = await params;

        const body = await request.json();
        const { productIds } = body; // All products that SHOULD have this category

        console.log(`[API] Syncing products for category ID: ${id}. Expected count: ${productIds?.length}`);

        if (!Array.isArray(productIds)) {
            return NextResponse.json({ success: false, error: 'Invalid productIds' }, { status: 400 });
        }

        // Fetch category to verify it exists
        const targetCategory = await Category.findById(id);
        if (!targetCategory) {
            return NextResponse.json({
                success: false,
                error: `Category not found (ID: ${id})`
            }, { status: 404 });
        }

        // 1. Remove this category from products that ARE NOT in the list
        const removeResult = await Product.updateMany(
            { categories: id, _id: { $nin: productIds } },
            { $pull: { categories: id } }
        );

        // 2. Add this category to products that ARE in the list
        const addResult = await Product.updateMany(
            { _id: { $in: productIds } },
            { $addToSet: { categories: id } }
        );

        console.log(`[API] Synced category ${targetCategory.name}. Removed from: ${removeResult.modifiedCount}, Added to: ${addResult.modifiedCount}`);

        return NextResponse.json({
            success: true,
            message: `Successfully updated ${targetCategory.name} assignments.`
        });
    } catch (error: any) {
        console.error(`[API ERROR] POST assigned-products:`, error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
