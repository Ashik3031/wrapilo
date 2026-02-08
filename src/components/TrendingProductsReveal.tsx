'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductCard from './ProductCard';

export default function TrendingProductsReveal() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the 8 newest products
        fetch('/api/products?limit=8&sort=newest')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data);
                }
            })
            .catch(err => console.error('Failed to fetch trending products:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading || products.length === 0) {
        return null;
    }

    return <TrendingProductsContent products={products} />;
}

function TrendingProductsContent({ products }: { products: any[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress within the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Split Curtains Animation
    // We want the curtains to start fully closed (0) and move out completely (100% / -100%)
    const leftPanelX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-100%"]);
    const rightPanelX = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

    // Products Layer - scale slightly for depth?
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <section ref={containerRef} className="relative h-[150vh] bg-white">
            <div className="sticky top-0 h-screen overflow-hidden">

                {/* Content Layer (Products) - Underneath */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-0">
                    <motion.div
                        style={{ scale, opacity }}
                        className="container mx-auto px-4 md:px-8 w-full h-full flex flex-col justify-center"
                    >
                        <div className="text-center mb-4 md:mb-8">
                            <h2 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Trending Now</h2>
                            <p className="text-xs md:text-sm text-gray-600">Curated selections just for you.</p>
                        </div>

                        {/* Grid of products - 2 rows, 4 columns on desktop, 2x2 on mobile */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto px-2">
                            {products.slice(0, typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 8).map((product: any) => (
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
                    </motion.div>
                </div>

                {/* Curtain Layer - Left Panel */}
                <motion.div
                    style={{ x: leftPanelX }}
                    className="absolute top-0 left-0 w-1/2 h-full bg-white z-20 flex items-center justify-end pr-4 md:pr-12 border-r border-gray-100 pointer-events-none"
                >
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter whitespace-nowrap overflow-hidden">
                        Trending
                    </h2>
                </motion.div>

                {/* Curtain Layer - Right Panel */}
                <motion.div
                    style={{ x: rightPanelX }}
                    className="absolute top-0 right-0 w-1/2 h-full bg-white z-20 flex items-center justify-start pl-4 md:pl-12 border-l border-gray-100 pointer-events-none"
                >
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter whitespace-nowrap overflow-hidden">
                        Products
                    </h2>
                </motion.div>

            </div>
        </section>
    );
}
