'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Loader2, CheckCircle, ArrowLeft, Phone, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { formatPrice } = useCurrency();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    // OTP States
    const [step, setStep] = useState(2); // 1: Verification, 2: Shipping
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isVerified, setIsVerified] = useState(true); // Default true to skip OTP
    const [verifying, setVerifying] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        country: 'United Arab Emirates', // Default
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendOtp = async () => {
        if (!formData.phone) {
            alert('Please enter your phone number');
            return;
        }
        setVerifying(true);
        try {
            const res = await fetch('/api/auth/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone }),
            });
            const data = await res.json();
            if (data.success) {
                setOtpSent(true);
                alert('OTP sent! (Check console for demo)');
            } else {
                alert(data.error || 'Failed to send OTP');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send OTP');
        } finally {
            setVerifying(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            alert('Please enter OTP');
            return;
        }
        setVerifying(true);
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone, otp }),
            });
            const data = await res.json();
            if (data.success) {
                setIsVerified(true);
                setStep(2);
                // If user exists and has a name, confirm it or let them edit
                if (data.user.name && !formData.name) {
                    setFormData(prev => ({ ...prev, name: data.user.name }));
                }
            } else {
                alert(data.error || 'Invalid OTP');
            }
        } catch (error) {
            console.error(error);
            alert('Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isVerified) {
            alert('Please verify your phone number first');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: formData,
                    items: cart.map(item => ({
                        product: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    })),
                    totalAmount: cartTotal,
                    paymentMethod: 'COD'
                }),
            });

            const data = await res.json();

            if (data.success) {
                setOrderId(data.order._id);
                setOrderSuccess(true);
                clearCart();
            } else {
                alert(data.error || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order failed', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-8 max-w-md">
                    Thank you, {formData.name}. Your order has been received and is being processed.
                    <br />Order ID: <span className="font-mono font-bold">{orderId}</span>
                </p>
                <div className="flex gap-4">
                    <Link href="/" className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                <Link href="/" className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8">
                <ArrowLeft size={16} /> Back to Shopping
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8 max-w-4xl mx-auto">Checkout</h1>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Form */}
                <div>
                    {/* OTP Verification Step - Commented out for now */}
                    {/* {step === 1 ? (
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Phone size={20} /> Login / Verify
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="54 123 4567"
                                            disabled={otpSent}
                                            className="w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                        />
                                        {!otpSent && (
                                            <button
                                                onClick={handleSendOtp}
                                                disabled={verifying || !formData.phone}
                                                className="bg-black text-white px-6 rounded-md font-medium text-sm whitespace-nowrap hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                {verifying ? <Loader2 className="animate-spin" size={16} /> : 'Send OTP'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {otpSent && (
                                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-sm font-medium text-gray-700">Enter OTP</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="1234"
                                                className="w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none tracking-widest text-center text-lg"
                                                maxLength={4}
                                            />
                                            <button
                                                onClick={handleVerifyOtp}
                                                disabled={verifying || otp.length !== 4}
                                                className="bg-black text-white px-6 rounded-md font-medium text-sm whitespace-nowrap hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                {verifying ? <Loader2 className="animate-spin" size={16} /> : 'Verify'}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Didn't receive code? <button onClick={() => setOtpSent(false)} className="text-black underline">Resend</button>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : ( */}
                    <div className="space-y-6">
                        {/* <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={20} className="text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-800">Verified</p>
                                        <p className="text-sm text-green-700">{formData.phone}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setStep(1); setIsVerified(false); setOtpSent(false); setOtp(''); }} className="text-sm text-green-700 underline">Change</button>
                            </div> */}

                        <h2 className="text-xl font-semibold">Shipping Details</h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    required
                                    rows={3}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">City</label>
                                    <input
                                        required
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none bg-white"
                                    >
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="Qatar">Qatar</option>
                                        <option value="Kuwait">Kuwait</option>
                                        <option value="Bahrain">Bahrain</option>
                                        <option value="Oman">Oman</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Summary */}
                <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-16 h-16 bg-white rounded-md overflow-hidden border border-gray-200 shrink-0">
                                    {item.image && (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="w-4 h-4 rounded-full border-[5px] border-black"></div>
                            <span className="font-medium text-sm">Cash on Delivery (COD)</span>
                        </div>
                    </div>

                    {/* {step === 2 && ( */}
                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={loading}
                        className="w-full mt-6 bg-black text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        Place Order
                    </button>
                    {/* )} */}

                    {/* {step === 1 && (
                        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 justify-center">
                            <Lock size={14} />
                            <span>Complete verification to proceed</span>
                        </div>
                    )} */}

                    <p className="text-xs text-gray-500 text-center mt-4">
                        By placing an order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
