'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Phone, ChevronDown, User, ShoppingBag, Heart } from 'lucide-react';
import CurrencySwitcher from './CurrencySwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

interface Category {
    _id: string;
    name: string;
    slug: string;
    parent?: string | Category | null;
    children?: Category[];
}

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const { wishlist } = useWishlist();
    const { cartCount, setIsCartOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header if scrolling up, hide if scrolling down
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        // Fetch Categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const allCategories: Category[] = data.data;

                    // Build Tree Structure
                    const categoryMap = new Map<string, Category>();

                    // First pass: create map and initialize children
                    allCategories.forEach(cat => {
                        cat.children = [];
                        categoryMap.set(cat._id, cat);
                    });

                    // Second pass: identify roots and move children
                    const roots: Category[] = [];
                    allCategories.forEach(cat => {
                        // Extract parent ID string
                        const parentId = cat.parent
                            ? (typeof cat.parent === 'object' ? (cat.parent as Category)._id : cat.parent)
                            : null;

                        // If it has a parent AND that parent exists in our map
                        if (parentId && categoryMap.has(parentId)) {
                            categoryMap.get(parentId)?.children?.push(cat);
                        } else {
                            // It's a root category if it has no parent or parent is invalid/missing in map
                            // BUT per user request, we strictly consider categories with NO parent as root
                            if (!parentId) {
                                roots.push(cat);
                            }
                        }
                    });

                    setCategories(roots);
                }
            })
            .catch(err => console.error('Failed to fetch categories', err));
    }, []);

    // Main navigation links (now mostly categories focused)
    const topLinks = [
        { name: 'Corporate Gifts', href: '/corporate' },
        { name: 'Sell With Us', href: '/sell' },
    ];

    return (
        <>
            <motion.header
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : -200 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-100 font-sans"
            >
                {/* Top Bar (Utility) */}
                <div className="bg-[#f7f7f7] border-b border-[#e5e5e5] hidden md:block">
                    <div className="container mx-auto px-8 py-1.5 flex justify-between items-center text-xs text-gray-600 font-medium">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1">Currency: <CurrencySwitcher /></span>
                            <span>More</span>
                        </div>
                        <div className="flex gap-6">
                            {topLinks.map(link => (
                                <Link key={link.name} href={link.href} className="hover:text-primary transition-colors">
                                    {link.name}
                                </Link>
                            ))}
                            <span className="flex items-center gap-1"><Phone size={12} className="fill-current" />Call Us: +971 54 405 7109</span>
                        </div>
                    </div>
                </div>

                {/* Main Header (Logo, Search, Actions) */}
                <div className="container mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-8 h-16 md:h-20">
                    {/* Mobile Menu */}
                    <button className="md:hidden p-2 text-gray-800" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="text-3xl md:text-4xl font-black tracking-tighter text-black shrink-0">
                        Wrapilo<span className="text-gray-400">.</span>
                    </Link>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xl relative">
                        <input
                            type="text"
                            placeholder="Find Gifts, Cakes, Flowers & more..."
                            className="w-full h-11 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6 shrink-0">
                        <Link href="/wishlist" className="hidden md:flex flex-col items-center text-xs font-medium cursor-pointer hover:text-black text-gray-600 transition-colors relative group">
                            <div className="relative">
                                <Heart size={22} className={cn("mb-0.5 transition-colors", wishlist.length > 0 && "fill-red-500 text-red-500")} />
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {wishlist.length}
                                    </span>
                                )}
                            </div>
                            <span>Wishlist</span>
                        </Link>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="flex flex-col items-center text-xs font-medium cursor-pointer hover:text-black text-gray-600 transition-colors relative group"
                        >
                            <div className="relative">
                                <ShoppingBag size={22} className="mb-0.5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span>Cart</span>
                        </button>
                    </div>
                </div>

                {/* Desktop Navigation (Categories) */}
                <div className="hidden md:block border-t border-gray-100 bg-white">
                    <div className="container mx-auto px-8">
                        <nav className="flex items-center gap-8 h-12">
                            {categories.map((cat) => (
                                <div
                                    key={cat._id}
                                    className="relative h-full flex items-center group"
                                    onMouseEnter={() => setHoveredCategory(cat._id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <Link
                                        href={`/collections/${cat.slug}`}
                                        className="text-sm font-semibold text-gray-800 hover:text-black uppercase tracking-wide flex items-center gap-1 py-3"
                                    >
                                        {cat.name}
                                        {cat.children && cat.children.length > 0 && (
                                            <ChevronDown size={14} className="text-gray-400 group-hover:text-black transition-colors" />
                                        )}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {cat.children && cat.children.length > 0 && (
                                        <div className="absolute top-full left-0 w-64 bg-white shadow-lg border border-gray-100 rounded-b-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
                                            {cat.children.map(sub => (
                                                <Link
                                                    key={sub._id}
                                                    href={`/collections/${sub.slug}`}
                                                    className="block px-6 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Link href="/collections/all" className="text-sm font-semibold text-red-600 hover:text-red-700 uppercase tracking-wide ml-auto">
                                Sale
                            </Link>
                        </nav>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-[85%] max-w-sm h-full bg-white z-[60] md:hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="p-5 flex justify-between items-center border-b border-gray-100">
                                <span className="font-bold text-lg">Menu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-4 space-y-2">
                                {categories.map((cat) => (
                                    <div key={cat._id} className="border-b border-gray-50 last:border-0 pb-2">
                                        {cat.children && cat.children.length > 0 ? (
                                            <MobileSubmenu category={cat} onClose={() => setIsMobileMenuOpen(false)} />
                                        ) : (
                                            <Link
                                                href={`/collections/${cat.slug}`}
                                                className="block py-3 text-base font-medium text-gray-800"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {cat.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                                <Link
                                    href="/collections/all"
                                    className="block py-3 text-base font-medium text-red-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sale
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <CartDrawer />
        </>
    );
}

// Helper component for mobile submenu accordion
function MobileSubmenu({ category, onClose }: { category: Category; onClose: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-3 text-base font-medium text-gray-800"
            >
                {category.name}
                <ChevronDown size={16} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50 rounded-lg"
                    >
                        <div className="pl-4 pr-2 py-2 space-y-1">
                            {/* Link to main category itself */}
                            <Link
                                href={`/collections/${category.slug}`}
                                onClick={onClose}
                                className="block py-2 text-sm font-semibold text-gray-900 border-b border-gray-100 mb-1"
                            >
                                Shop All {category.name}
                            </Link>
                            {/* Subcategories */}
                            {category.children?.map(sub => (
                                <Link
                                    key={sub._id}
                                    href={`/collections/${sub.slug}`}
                                    onClick={onClose}
                                    className="block py-2 text-sm text-gray-600 hover:text-black"
                                >
                                    {sub.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
