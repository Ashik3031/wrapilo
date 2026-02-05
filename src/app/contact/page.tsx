import { MapPin, Phone } from 'lucide-react';

export const metadata = {
    title: 'Contact Us | Wrapilo Moments',
    description: 'Get in touch with us for any inquiries.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
                Have questions or need assistance? We're here to help. Reach out to the appropriate department below.
            </p>



            {/* Customer Support & WhatsApp */}
            <div className="bg-white p-8 rounded-2xl border-2 border-green-50 shadow-sm text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#25D366]">
                    <Phone size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Customer Care</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Prefer to chat? Connect with us on WhatsApp or call us directly for orders and support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="https://wa.me/971544692469?text=Hi%2C%20I'm%20interested%20in%20placing%20an%20order%20with%20Wrapilo."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:bg-[#128C7E] transition-all"
                    >
                        <span className="text-xl">💬</span>
                        WhatsApp Chat
                    </a>
                    <a
                        href="tel:+971544692469"
                        className="flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-gray-200 font-bold hover:bg-gray-50 transition-all text-gray-800"
                    >
                        <Phone size={20} />
                        +971 54 469 2469
                    </a>
                </div>
            </div>

            <div className="mt-16 text-center border-t border-gray-100 pt-8">
                <p className="text-gray-400 text-sm">
                    Wrapilo Moments - Curated Gifts for Every Occasion.
                </p>
            </div>
        </div>
    );
}
