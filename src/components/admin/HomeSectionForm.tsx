'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
}

interface HomeSection {
    _id?: string;
    title: string;
    type: 'subcategories' | 'products' | 'featured';
    category: string | Category;
    order: number;
    isActive: boolean;
}

interface HomeSectionFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: HomeSection | null;
    categories: Category[];
    onSuccess: () => void;
}

export default function HomeSectionForm({ isOpen, onClose, initialData, categories, onSuccess }: HomeSectionFormProps) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'subcategories' | 'products' | 'featured'>('subcategories');
    const [categoryId, setCategoryId] = useState('');
    const [order, setOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setType(initialData.type);
            setCategoryId(
                typeof initialData.category === 'object' && initialData.category
                    ? initialData.category._id
                    : initialData.category || ''
            );
            setOrder(initialData.order);
            setIsActive(initialData.isActive);
        } else {
            setTitle('');
            setType('subcategories');
            setCategoryId('');
            setOrder(0);
            setIsActive(true);
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            title,
            type,
            category: categoryId,
            order,
            isActive
        };

        const url = initialData?._id ? `/api/home-sections/${initialData._id}` : '/api/home-sections';
        const method = initialData?._id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || 'Failed to save section'}`);
            }
        } catch (error) {
            console.error('Save error', error);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? 'Edit Home Section' : 'Add Home Section'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Birthday Gifts That Wow"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Type</label>
                            <select
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                            >
                                <option value="subcategories">Subcategories</option>
                                <option value="products">Products</option>
                                <option value="featured">Featured Collection</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                value={order}
                                onChange={(e) => setOrder(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Source Category</label>
                        <select
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        <p className="mt-1.5 text-xs text-gray-500 italic">
                            {type === 'subcategories'
                                ? 'Shows subcategories of this category.'
                                : type === 'featured'
                                    ? 'Shows subcategories in circular icons (compact layout).'
                                    : 'Shows products directly from this category.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            className="w-4 h-4 rounded text-black focus:ring-black"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Active (Show on Home Page)
                        </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {initialData ? 'Update Section' : 'Save Section'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
