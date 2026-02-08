'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch featured products (assuming isFeatured is a field, or just take new ones)
        // Since we didn't explicitly implement 'featured' toggle in UI yet, we can filter by that or just take recent
        fetch('/api/products?limit=8&featured=true')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data);
                }
            })
            .catch(err => console.error('Failed to fetch featured products:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-gray-50/50">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-3xl font-bold">New Arrivals</h2>
                        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl font-bold">New Arrivals</h2>
                    <Link href="/collections/all" className="text-sm font-medium border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    {products.map((product: any) => (
                        <ProductCard
                            key={product._id}
                            id={product._id}
                            name={product.name}
                            price={product.price}
                            images={product.images}
                            category={Array.isArray(product.categories) && product.categories.length > 0 ? (typeof product.categories[0] === 'object' ? product.categories[0].name : '') : ''}
                            slug={product.slug}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
