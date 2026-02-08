import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';

export async function POST(request: Request) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const { products } = body;

        if (!Array.isArray(products)) {
            return NextResponse.json({ success: false, error: 'Invalid products data' }, { status: 400 });
        }

        const results = [];
        for (const p of products) {
            // 1. Find or create category
            let category = await Category.findOne({ name: { $regex: new RegExp(`^${p.category}$`, 'i') } });

            if (!category) {
                const categorySlug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                category = await Category.create({
                    name: p.category,
                    slug: categorySlug
                });
            }

            // 2. Create product
            const productData = {
                ...p,
                images: p.images.length > 0 ? p.images : ['https://placehold.co/600x600?text=Product'],
                categories: [category._id],
                slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            };

            // Check if product already exists by slug
            const existingProduct = await Product.findOne({ slug: productData.slug });
            if (existingProduct) {
                // Update existing product
                const updated = await Product.findByIdAndUpdate(existingProduct._id, productData, { new: true });
                results.push({ action: 'updated', id: updated?._id });
            } else {
                // Create new product
                const created = await Product.create(productData);
                results.push({ action: 'created', id: created._id });
            }
        }

        return NextResponse.json({ success: true, count: results.length, data: results });
    } catch (error: any) {
        console.error('Bulk upload error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
