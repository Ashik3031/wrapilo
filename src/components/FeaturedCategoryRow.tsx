'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
}

interface FeaturedCategoryRowProps {
    categoryId?: string;
    title?: string;
}

export default function FeaturedCategoryRow({ categoryId, title = "Current Trending" }: FeaturedCategoryRowProps) {
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [mainCategory, setMainCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();

                if (data.success) {
                    const allCategories: Category[] = data.data;

                    // If no categoryId provided, use the first root category
                    let targetCategory: Category | undefined;

                    if (categoryId) {
                        targetCategory = allCategories.find(c => c._id === categoryId);
                    } else {
                        // Find first root category (no parent)
                        targetCategory = allCategories.find((c: any) => !c.parent);
                    }

                    if (targetCategory) {
                        setMainCategory(targetCategory);

                        // Find subcategories
                        const subs = allCategories.filter((cat: any) => {
                            const parentId = cat.parent?._id || cat.parent;
                            return parentId === targetCategory._id;
                        });

                        setSubcategories(subs);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    if (loading) {
        return (
            <div className="container mx-auto px-8 py-12 flex justify-center">
                <Loader2 className="animate-spin text-gray-200" size={32} />
            </div>
        );
    }

    if (!mainCategory || subcategories.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        {title}
                    </h2>
                    <Link
                        href={`/collections/${mainCategory.slug}`}
                        className="text-sm font-bold text-gray-900 flex items-center gap-1 hover:underline underline-offset-4 decoration-2"
                    >
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
                    {subcategories.map((cat) => (
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
            </div>
        </section>
    );
}
