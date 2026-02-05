'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 min-h-[60vh]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 mb-2">
                        My <span className="text-red-500">Wishlist</span>
                    </h1>
                    <p className="text-gray-500 font-medium">
                        {wishlist.length === 0
                            ? "Your wishlist is empty."
                            : `You have ${wishlist.length} item${wishlist.length === 1 ? '' : 's'} saved.`}
                    </p>
                </div>
                <Link
                    href="/collections/all"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
                >
                    <ArrowLeft size={16} />
                    Continue Shopping
                </Link>
            </div>

            {wishlist.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
                >
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                        <Heart size={32} className="text-gray-200" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet?</h2>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto">
                        Tap the heart icon on any product to save it for later.
                        No account needed!
                    </p>
                    <Link
                        href="/collections/all"
                        className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg"
                    >
                        <ShoppingBag size={20} />
                        Explore Products
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                    <AnimatePresence>
                        {wishlist.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="relative group"
                            >
                                <ProductCard
                                    id={item._id}
                                    name={item.name}
                                    price={item.price}
                                    image={item.image}
                                    images={item.images}
                                    category={item.category}
                                    slug={item.slug}
                                />
                                <button
                                    onClick={() => removeFromWishlist(item._id)}
                                    className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Features Info */}
            {wishlist.length > 0 && (
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="text-center">
                        <div className="text-2xl mb-2">⭐</div>
                        <h4 className="font-bold text-gray-900">Saved Locally</h4>
                        <p className="text-sm text-gray-500">Your list is saved in your browser. No login required.</p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">📱</div>
                        <h4 className="font-bold text-gray-900">Access Anytime</h4>
                        <p className="text-sm text-gray-500">Come back later and your favorites will still be here.</p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">💝</div>
                        <h4 className="font-bold text-gray-900">Shareable Soon</h4>
                        <p className="text-sm text-gray-500">Next update: Share your wishlist with friends!</p>
                    </div>
                </div>
            )}
        </div>
    );
}
