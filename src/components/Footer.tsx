import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="text-2xl font-bold tracking-tight mb-4 block">
                            Wrapilo Moments<span className="text-accent">.</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Curated gifts for every occasion. Elegant, minimal, and thoughtful.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/collections/all" className="hover:text-black transition-colors">All Products</Link></li>
                            <li><Link href="/collections/new" className="hover:text-black transition-colors">New Arrivals</Link></li>
                            <li><Link href="/collections/best-sellers" className="hover:text-black transition-colors">Best Sellers</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
                            <li><Link href="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-2 text-sm text-gray-500">

                            <li className="flex items-start gap-2 mt-4 text-gray-900 font-medium">
                                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5">W</span>
                                <div>
                                    <span className="block text-xs uppercase text-gray-400 font-bold mb-1">Orders & WhatsApp:</span>
                                    <a href="tel:+971544057109" className="hover:text-black block transition-all">+971 54 405 7109</a>
                                    <a
                                        href="https://wa.me/971544057109?text=Hi%2C%20I'm%20interested%20in%20placing%20an%20order%20with%20Wrapilo."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#25D366] hover:underline transition-all block text-xs mt-1"
                                    >
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                                <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-black">
                                    <Instagram size={18} />
                                </a>
                                <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-black">
                                    <Facebook size={18} />
                                </a>
                                <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-black">
                                    <Twitter size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} Wrapilo Moments. All rights reserved.</p>
                    <p>Designed with Care.</p>
                </div>
            </div>
        </footer>
    );
}
