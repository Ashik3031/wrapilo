'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface HeroConfig {
    tagline: string;
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    backgroundImage: string;
}

export default function Hero() {
    const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeroConfig = async () => {
            try {
                const res = await fetch('/api/hero', { cache: 'no-store' });
                const data = await res.json();
                if (data.success && data.data) {
                    setHeroConfig(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch hero config", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroConfig();
    }, []);

    // Fallbacks while loading or if data is missing
    const content = heroConfig || {
        tagline: "Celebration of Love",
        title: "Make This Valentine's <br className=\"hidden md:block\" /> <span className=\"text-secondary\">Unforgettable</span>",
        description: "From elegant roses to personalized keepsakes, find the perfect way to say \"I Love You\".",
        primaryButtonText: "Shop Valentine's",
        primaryButtonLink: "/collections/valentines",
        secondaryButtonText: "View All Gifts",
        secondaryButtonLink: "/collections/all",
        backgroundImage: "/images/valentine_hero_v2.jpg"
    };

    return (
        <section className="relative h-[550px] md:h-[650px] w-full bg-secondary overflow-hidden flex items-center justify-center">
            {/* Background Image / Abstract Element */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
                style={{ backgroundImage: `url(${content.backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container mx-auto px-4 text-center z-10 text-white">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <Loader2 className="animate-spin text-white/50" size={48} />
                    </div>
                ) : (
                    <>
                        <motion.span
                            className="inline-block px-4 py-1 border border-white/40 rounded-full text-[10px] md:text-sm font-medium mb-4 backdrop-blur-sm uppercase tracking-widest"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {content.tagline}
                        </motion.span>
                        <motion.h1
                            className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            dangerouslySetInnerHTML={{ __html: content.title }}
                        />

                        <motion.p
                            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {content.description}
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Link
                                href={content.primaryButtonLink}
                                className="inline-block bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-all hover:scale-105 shadow-lg"
                            >
                                {content.primaryButtonText}
                            </Link>
                            <Link
                                href={content.secondaryButtonLink}
                                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-md"
                            >
                                {content.secondaryButtonText}
                            </Link>
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
}
