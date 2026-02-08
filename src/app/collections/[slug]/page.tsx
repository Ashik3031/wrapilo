'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    categories: any[];
    slug: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
}

export default function CollectionPage() {
    const { slug } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch category info
                if (slug !== 'all') {
                    const catRes = await fetch('/api/categories');
                    const catData = await catRes.json();
                    if (catData.success) {
                        const foundCategory = catData.data.find((c: Category) => c.slug === slug);
                        setCategory(foundCategory || null);
                    }
                }

                // Fetch products
                const productsUrl = slug === 'all'
                    ? '/api/products'
                    : `/api/products?category=${slug}`;

                const prodRes = await fetch(productsUrl);
                const prodData = await prodRes.json();

                if (prodData.success) {
                    setProducts(prodData.data);
                }
            } catch (error) {
                console.error('Failed to fetch collection data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center gap-4 min-h-screen">
                <Loader2 className="animate-spin text-gray-200" size={48} />
                <p className="text-gray-400 font-medium tracking-wide animate-pulse">Loading collection...</p>
            </div>
        );
    }

    const displayName = slug === 'all'
        ? 'All Products'
        : category?.name || String(slug).replace(/-/g, ' ');

    const displayDescription = slug === 'all'
        ? 'Explore our carefully curated selection of premium items.'
        : category?.description || 'Discover our collection of quality products.';

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 mt-[100px] md:mt-[145px]">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 capitalize">
                    {displayName}
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    {displayDescription}
                </p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No products found in this collection.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    {products.map((product) => (
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
    );
}
