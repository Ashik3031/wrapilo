'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative h-[550px] md:h-[650px] w-full bg-secondary overflow-hidden flex items-center justify-center">
            {/* Background Image / Abstract Element */}
            <div className="absolute inset-0 z-0 bg-[url('/images/valentine_hero_v2.jpg')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container mx-auto px-4 text-center z-10 text-white">
                <motion.span
                    className="inline-block px-4 py-1 border border-white/40 rounded-full text-[10px] md:text-sm font-medium mb-4 backdrop-blur-sm uppercase tracking-widest"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Celebration of Love
                </motion.span>
                <motion.h1
                    className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Make This Valentine's <br className="hidden md:block" /> <span className="text-secondary">Unforgettable</span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    From elegant roses to personalized keepsakes, find the perfect way to say "I Love You".
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Link
                        href="/collections/valentines"
                        className="inline-block bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-all hover:scale-105 shadow-lg"
                    >
                        Shop Valentine's
                    </Link>
                    <Link
                        href="/collections/all"
                        className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-md"
                    >
                        View All Gifts
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
