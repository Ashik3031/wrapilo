'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
}

export default function FeaturedCollections() {
    const [collections, setCollections] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Filter out subcategories (only show root categories)
                    const rootCategories = data.data.filter((c: any) => !c.parent);
                    // Take first 3 for featured display
                    setCollections(rootCategories.slice(0, 3));
                }
            })
            .catch(err => console.error('Failed to fetch categories:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (collections.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <h2 className="text-3xl font-bold mb-12 text-center">Featured Collections</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {collections.map((collection) => (
                        <Link key={collection._id} href={`/collections/${collection.slug}`} className="group block relative overflow-hidden rounded-lg aspect-[3/4]">
                            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                <Image
                                    src={collection.image || 'https://placehold.co/600x800/d4af37/ffffff?text=' + collection.name}
                                    alt={collection.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                            <div className="absolute bottom-8 left-8 text-white z-10">
                                <h3 className="text-2xl font-bold">{collection.name}</h3>
                                <span className="text-sm font-medium underline opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">
                                    View Collection
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
