'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function SeasonalCollections() {
    const [valentineSubcategories, setValentineSubcategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Find Valentine's Day category (handling potential typos like 'Valentne')
                    const valentineCategory = data.data.find((c: any) =>
                        c.name.toLowerCase().includes('valen') ||
                        c.slug.toLowerCase().includes('valen')
                    );

                    if (valentineCategory) {
                        // Get all subcategories of Valentine's Day
                        const subcats = data.data.filter((c: any) => {
                            const parentId = c.parent?._id || c.parent;
                            return parentId === valentineCategory._id;
                        });

                        // If subcategories exist, use them; otherwise fallback to root categories
                        if (subcats.length > 0) {
                            setValentineSubcategories(subcats);
                        } else {
                            const rootCategories = data.data.filter((c: any) => !c.parent);
                            setValentineSubcategories(rootCategories);
                        }
                    } else {
                        // Fallback: show root categories if no valentine category found
                        const rootCategories = data.data.filter((c: any) => !c.parent);
                        setValentineSubcategories(rootCategories);
                    }
                }
            })
            .catch(err => console.error('Failed to fetch categories:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading || valentineSubcategories.length === 0) {
        return null;
    }

    return <ValentineCollectionsContent collections={valentineSubcategories} />;
}

function ValentineCollectionsContent({ collections }: { collections: any[] }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollRange, setScrollRange] = useState(0);

    // Measure content width to determine how far to scroll
    useEffect(() => {
        if (contentRef.current && collections.length > 0) {
            const calculateScroll = () => {
                const width = contentRef.current?.scrollWidth || 0;
                const viewportWidth = window.innerWidth;
                setScrollRange(width - viewportWidth + 100);
            };

            setTimeout(calculateScroll, 100);
            window.addEventListener('resize', calculateScroll);
            return () => window.removeEventListener('resize', calculateScroll);
        }
    }, [collections]);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${scrollRange}px`]);

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={targetRef} className="relative h-[400vh] bg-gradient-to-br from-pink-50 via-red-50 to-pink-100">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

                {/* Floating Hearts Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-red-400"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: window.innerHeight + 50,
                                scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{
                                y: -100,
                                x: Math.random() * window.innerWidth
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <Heart size={40} fill="currentColor" />
                        </motion.div>
                    ))}
                </div>

                {/* Horizontal Container */}
                <motion.div
                    ref={contentRef}
                    style={{ x }}
                    className="flex items-center gap-8 pl-4 md:pl-12 w-max relative z-10"
                >
                    {/* 1. Intro Text Block */}
                    <div className="w-[90vw] md:w-[40vw] lg:w-[30vw] flex flex-col justify-center shrink-0 pr-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Heart className="text-red-500" size={32} fill="currentColor" />
                                <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">Valentine's Special</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black uppercase leading-tight mb-6">
                                Happy <span className="text-red-500">Valentine's</span> Day
                            </h2>
                            <p className="text-gray-700 mb-10 max-w-md text-lg leading-relaxed">
                                Celebrate love with our exclusive Valentine's collection.
                                From romantic roses to heartfelt gifts, find the perfect way to express your love.
                            </p>
                            <Link
                                href="/collections/valentine"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
                            >
                                <Heart size={20} fill="currentColor" />
                                Discover Collection
                            </Link>
                        </motion.div>
                    </div>

                    {/* 2. Valentine's Subcategory Cards */}
                    {collections.map((col, index) => (
                        <motion.div
                            key={col._id}
                            className="w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/collections/${col.slug}`}>
                                <div className="relative group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-pink-100 hover:border-red-300">
                                    <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-pink-100 to-red-100">
                                        {col.image ? (
                                            <img
                                                src={col.image}
                                                alt={col.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Heart size={80} className="text-red-300" fill="currentColor" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm p-6 rounded-2xl max-w-[200px] shadow-xl border border-pink-200">
                                        <p className="text-gray-800 font-medium leading-relaxed">
                                            {col.description || 'Discover our new collection'}
                                        </p>
                                    </div>

                                    <div className="p-8 flex items-center justify-between bg-gradient-to-r from-pink-50 to-red-50">
                                        <h3 className="text-2xl font-bold max-w-[60%] leading-tight text-gray-900">
                                            {col.name}
                                        </h3>
                                        <div className="px-6 py-3 rounded-full bg-red-500 text-white text-sm font-semibold group-hover:bg-red-600 transition-colors uppercase tracking-wide flex items-center gap-2">
                                            <Heart size={16} fill="currentColor" />
                                            Shop Now
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* End Spacer */}
                    <div className="w-[5vw] shrink-0" />
                </motion.div>

                {/* Progress Bar */}
                <div className="absolute bottom-8 lg:bottom-12 left-0 w-full px-4 md:px-12 z-50">
                    <div className="relative h-[3px] bg-pink-200 w-full overflow-hidden rounded-full">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-red-500 origin-left"
                            style={{ scaleX }}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
