'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface Section {
    _id: string;
    title: string;
    type: 'subcategories' | 'products' | 'featured';
    category: { _id: string; name: string; slug: string } | string;
    order: number;
}

export default function DynamicHomeSection({ section }: { section: Section }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categoryId = typeof section.category === 'object' ? section.category._id : section.category;
    const categorySlug = typeof section.category === 'object' ? section.category.slug : '';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (section.type === 'subcategories' || section.type === 'featured') {
                    // Fetch all categories and filter for children of this category
                    const res = await fetch('/api/categories');
                    const json = await res.json();
                    if (json.success) {
                        const subcats = json.data.filter((cat: any) => {
                            const parentId = cat.parent?._id || cat.parent;
                            return parentId === categoryId;
                        });
                        setData(subcats);
                    }
                } else {
                    // Fetch products for this category
                    const res = await fetch(`/api/products?category=${categoryId}&limit=8`);
                    const json = await res.json();
                    if (json.success) {
                        setData(json.data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch section data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [section, categoryId]);

    if (loading) {
        return (
            <div className="container mx-auto px-8 py-12 flex justify-center">
                <Loader2 className="animate-spin text-gray-200" size={32} />
            </div>
        );
    }

    if (data.length === 0) return null;

    // Featured Collection Style (Circular icons, compact)
    if (section.type === 'featured') {
        return (
            <section className="py-8 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                            {section.title}
                        </h2>
                        <Link
                            href={`/collections/${categorySlug}`}
                            className="text-xs font-bold text-gray-900 flex items-center gap-1 hover:underline underline-offset-4 decoration-2"
                        >
                            View All <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="flex gap-4 md:gap-8 overflow-x-auto md:justify-center pb-4 scrollbar-hide">
                        {data.map((cat: any) => (
                            <Link
                                key={cat._id}
                                href={`/collections/${cat.slug}`}
                                className="group flex flex-col items-center gap-2 min-w-[90px] md:min-w-[120px]"
                            >
                                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
                                    {cat.image ? (
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl font-bold">
                                            {cat.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] md:text-sm font-semibold text-gray-700 group-hover:text-black text-center line-clamp-2 w-full">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Regular rendering for subcategories and products
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        {section.title}
                    </h2>
                    <Link
                        href={`/collections/${categorySlug}`}
                        className="text-sm font-bold text-gray-900 flex items-center gap-1 hover:underline underline-offset-4 decoration-2"
                    >
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {section.type === 'subcategories' ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
                        {data.map((cat) => (
                            <Link key={cat._id} href={`/collections/${cat.slug}`} className="group block text-center">
                                <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden mb-3 bg-gray-50 border border-gray-100 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                                    {cat.image ? (
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-black line-clamp-1 px-1">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {data.map((product) => (
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
                )}
            </div>
        </section>
    );
}
