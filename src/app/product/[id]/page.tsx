'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';
import { Phone, Clock, Calendar, Check, Star, Loader2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    category: any;
    rating?: number;
    reviews?: number;
    slug?: string;
}

export default function ProductPage() {
    const { id } = useParams();
    const { formatPrice, currency } = useCurrency();
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    // Enquiry State
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProduct(data.data);
                } else {
                    setError('Product not found');
                }
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load product');
            })
            .finally(() => setLoading(false));
    }, [id]);

    // WhatsApp Logic
    const handleEnquiry = () => {
        if (!product) return;

        if (!date || !time) {
            alert('Please select a preferred date and time for delivery/viewing.');
            return;
        }

        const message = `Hi, I'm interested in the ${product.name}.
    
Price: ${formatPrice(product.price)}
Preferred Date: ${date}
Preferred Time: ${time}
Currency: ${currency}

Can you please provide more details?`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/971123456789?text=${encodedMessage}`, '_blank');
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-gray-300" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-500">
                <p className="text-xl mb-4">{error || 'Product not found'}</p>
                <a href="/" className="underline hover:text-black">Return Home</a>
            </div>
        );
    }

    const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg'];
    const categoryName = typeof product.category === 'object' ? product.category?.name : 'Product';

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 mt-[80px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                {/* Left: Image Gallery */}
                <div className="space-y-4">
                    <motion.div
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src={images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Only show thumbnail grid if more than 1 image */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${selectedImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details & Enquiry */}
                <div className="flex flex-col">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">{categoryName}</span>
                        {product.rating && (
                            <>
                                <span className="text-gray-300">|</span>
                                <div className="flex items-center gap-1 text-sm text-yellow-500">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-gray-600 ml-1">{product.rating} ({product.reviews} reviews)</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-4 mb-6">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-0">{product.name}</h1>
                        <button
                            onClick={() => {
                                if (isInWishlist(product._id)) {
                                    removeFromWishlist(product._id);
                                } else {
                                    addToWishlist({
                                        _id: product._id,
                                        name: product.name,
                                        price: product.price,
                                        image: images[0],
                                        category: categoryName,
                                        slug: product.slug || ''
                                    });
                                }
                            }}
                            className={`p-3 rounded-full border transition-all ${isInWishlist(product._id)
                                ? 'bg-red-50 border-red-200 text-red-500'
                                : 'bg-white border-gray-200 text-gray-400 hover:text-black hover:border-black'
                                }`}
                            title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart size={24} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                        </button>
                    </div>

                    <p className="text-2xl font-semibold text-gray-900 mb-8">{formatPrice(product.price)}</p>

                    <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed max-w-none">
                        {product.description}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
                        <h3 className="font-semibold text-gray-900">Enquire Availability</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar size={16} /> Preferred Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-white text-sm outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Clock size={16} /> Preferred Time
                                </label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-white text-sm outline-none"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleEnquiry}
                            className="w-full bg-[#25D366] hover:bg-[#20b858] text-white py-4 rounded-lg font-bold flex items-center justify-center gap-3 transition-colors shadow-sm hover:shadow-md"
                        >
                            <Phone size={20} />
                            Enquire via WhatsApp
                        </button>

                        <p className="text-xs text-center text-gray-400">
                            No payment required. Chat with us to confirm details.
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-10 space-y-4 border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Check size={18} className="text-green-600" />
                            <span>Authenticity Guaranteed</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Check size={18} className="text-green-600" />
                            <span>Premium Packaging Included</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
