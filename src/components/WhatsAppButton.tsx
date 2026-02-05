'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const phoneNumber = "971544692469";
    const message = encodeURIComponent("Hi, I'm interested in placing an order with Wrapilo.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-105 group"
            aria-label="Chat on WhatsApp"
        >
            <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                <MessageCircle size={24} fill="currentColor" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider leading-none mb-0.5 opacity-80">Order Now</span>
                <span className="text-sm font-bold leading-none">WhatsApp Us</span>
            </div>

            {/* Pulsing effect */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none"></span>
        </a>
    );
}
