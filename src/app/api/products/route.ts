import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Product from '@/lib/models/Product';

export async function GET(request: Request) {
    await connectToDatabase();
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');
        const category = searchParams.get('category'); // Can be ID or slug
        const limit = searchParams.get('limit');
        const sort = searchParams.get('sort');

        const query: any = {};
        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Handle category filtering (by ID or slug)
        if (category) {
            // First, try to find the category by ID or slug
            const Category = (await import('@/lib/models/Category')).default;
            let categoryDoc;

            // Check if it's a MongoDB ObjectId (24 hex characters)
            if (/^[0-9a-fA-F]{24}$/.test(category)) {
                categoryDoc = await Category.findById(category);
            } else {
                // It's a slug
                categoryDoc = await Category.findOne({ slug: category });
            }

            if (categoryDoc) {
                // Find all subcategories
                const allCategories = await Category.find({});
                const subcategoryIds = [categoryDoc._id];

                // Recursively find all subcategories
                const findSubcategories = (parentId: any) => {
                    const children = allCategories.filter((cat: any) => {
                        const catParentId = cat.parent?._id || cat.parent;
                        return catParentId && catParentId.toString() === parentId.toString();
                    });
                    children.forEach((child: any) => {
                        subcategoryIds.push(child._id);
                        findSubcategories(child._id);
                    });
                };

                findSubcategories(categoryDoc._id);

                // Query products that belong to this category or any of its subcategories
                query.categories = { $in: subcategoryIds };
            }
        }

        let productsQuery = Product.find(query).populate('categories');

        if (sort === 'newest') {
            productsQuery = productsQuery.sort({ createdAt: -1 });
        } else if (sort === 'price_asc') {
            productsQuery = productsQuery.sort({ price: 1 });
        } else if (sort === 'price_desc') {
            productsQuery = productsQuery.sort({ price: -1 });
        } else {
            productsQuery = productsQuery.sort({ createdAt: -1 }); // Default sort
        }

        if (limit) {
            productsQuery = productsQuery.limit(parseInt(limit));
        }

        const products = await productsQuery.exec();
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 400 });
    }
}
