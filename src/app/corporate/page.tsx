'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, ArrowLeft } from 'lucide-react';

export default function CorporateGiftsPage() {
    const phoneNumber = "971544692469";
    const message = encodeURIComponent("Hi, I'm interested in Corporate Gifting with Wrapilo.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-pink-50 to-white px-4 py-20">
            <div className="max-w-2xl w-full text-center">
                <div className="flex justify-center mb-8">
                    <div className="bg-red-50 p-6 rounded-full text-red-500 animate-pulse">
                        <Heart size={64} fill="currentColor" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                    Corporate <span className="text-red-500">Gifting</span>
                </h1>

                <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                    Our specialized corporate gifting platform is almost ready.
                    Elevate your business relationships with premium, curated moments.
                </p>

                <div className="inline-block bg-white p-8 rounded-3xl shadow-xl border border-pink-100 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to place a bulk order?</h2>
                    <p className="text-gray-500 mb-6">Contact our corporate team directly via WhatsApp for custom solutions and bulk pricing.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:bg-[#128C7E] transition-all shadow-lg hover:shadow-xl"
                        >
                            <MessageCircle size={20} fill="currentColor" />
                            WhatsApp Corporate Team
                        </a>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-gray-200 font-bold hover:bg-gray-50 transition-all font-medium text-gray-600"
                        >
                            <ArrowLeft size={20} />
                            Back to Shop
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center gap-8 text-sm text-gray-400 font-bold uppercase tracking-widest">
                    <span>Quality</span>
                    <span className="text-red-300">•</span>
                    <span>Experience</span>
                    <span className="text-red-300">•</span>
                    <span>Elegance</span>
                </div>
            </div>
        </div>
    );
}
