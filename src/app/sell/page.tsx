'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react';

export default function SellWithUsPage() {
    const phoneNumber = "971544057109";
    const message = encodeURIComponent("Hi, I'm interested in selling my products on Wrapilo.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-20">
            <div className="max-w-2xl w-full text-center">
                <div className="flex justify-center mb-8">
                    <div className="bg-black p-6 rounded-full text-white shadow-2xl">
                        <ShoppingBag size={64} />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                    Sell <span className="text-gray-400">With</span> Us
                </h1>

                <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                    Partner with Wrapilo and reach thousands of customers looking for premium gifts.
                    Our vendor dashboard is launching soon.
                </p>

                <div className="inline-block bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Become a Partner</h2>
                    <p className="text-gray-500 mb-6">Interested in showcasing your products on our platform? Message our partnership team to get started.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:bg-[#128C7E] transition-all shadow-lg hover:shadow-xl"
                        >
                            <MessageCircle size={20} fill="currentColor" />
                            Contact Partnerships
                        </a>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-gray-200 font-bold hover:bg-gray-50 transition-all font-medium text-gray-600"
                        >
                            <ArrowLeft size={20} />
                            Back to Home
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center gap-8 text-sm text-gray-400 font-bold uppercase tracking-widest">
                    <span>Partnership</span>
                    <span className="text-gray-300">•</span>
                    <span>Growth</span>
                    <span className="text-gray-300">•</span>
                    <span>Success</span>
                </div>
            </div>
        </div>
    );
}
