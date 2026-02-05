'use client';

import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    id: string | number;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    category: string;
    slug: string;
}

export default function ProductCard({ id, name, price, image, images, category, slug }: ProductCardProps) {
    const { formatPrice } = useCurrency();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const displayImage = image || (images && images.length > 0 ? images[0] : '/placeholder.jpg');

    const isLoved = isInWishlist(String(id));

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoved) {
            removeFromWishlist(String(id));
        } else {
            addToWishlist({ _id: String(id), name, price, image: displayImage, category, slug });
        }
    };

    return (
        <div className="group block relative">
            <Link href={`/product/${id}`}>
                <div className="relative overflow-hidden rounded-md bg-gray-100 aspect-square mb-4">
                    {/* Image with hover zoom */}
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${displayImage})` }}
                    />

                    {/* Quick Add / View button (optional overlay) */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-full bg-white/90 backdrop-blur text-black py-2 rounded-full text-sm font-medium shadow-sm hover:bg-white transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
            </Link>

            {/* Wishlist Heart Button */}
            <button
                onClick={toggleWishlist}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-300"
            >
                <Heart
                    size={18}
                    className={cn("transition-colors", isLoved ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-gray-600")}
                />
            </button>

            <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{category}</p>
                <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                    {name}
                </h3>
                <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(price)}
                </p>
            </div>
        </div>
    );
}
