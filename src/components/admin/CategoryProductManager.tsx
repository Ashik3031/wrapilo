'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Search, CheckCircle2, Circle } from 'lucide-react';

interface CategoryProductManagerProps {
    category: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CategoryProductManager({ category, isOpen, onClose, onSuccess }: CategoryProductManagerProps) {
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [assignedIds, setAssignedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && category) {
            console.log('[DEBUG] CategoryProductManager open for:', category);
            fetchData();
        }
    }, [isOpen, category]);

    const fetchData = async () => {
        const catId = category?._id || category?.id;

        if (!category || !catId) {
            console.error('[ERROR] CategoryProductManager: No ID found in category object:', category);
            setError(`Invalid category data: ID is missing.`);
            return;
        }

        const categoryId = catId.toString();
        setLoading(true);
        setError('');
        try {
            const [allRes, assignedRes] = await Promise.all([
                fetch('/api/products', { cache: 'no-store' }),
                fetch(`/api/categories/${categoryId}/assigned-products`, { cache: 'no-store' })
            ]);

            const allData = await allRes.json();
            const assignedData = await assignedRes.json();

            if (allData.success) {
                setAllProducts(allData.data);
            }
            if (assignedData.success) {
                setAssignedIds(assignedData.data);
            }
        } catch (err: any) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleProduct = (productId: string) => {
        setAssignedIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSave = async () => {
        const catId = category?._id || category?.id;

        if (!catId) {
            setError('Cannot save: Category ID is undefined.');
            return;
        }

        const categoryId = catId.toString();
        setSaving(true);
        setError('');
        try {
            const res = await fetch(`/api/categories/${categoryId}/assigned-products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productIds: assignedIds })
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message || 'Changes applied successfully!');
                onSuccess();
                onClose();
            } else {
                throw new Error(data.error || 'Failed to save assignments');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold">Manage Category Products</h2>
                        <p className="text-sm text-gray-400">Add or remove products from <span className="text-black font-semibold font-mono">{category.name}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-300">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="font-medium">Fetching inventory...</span>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => {
                            const isSelected = assignedIds.includes(product._id);
                            return (
                                <div
                                    key={product._id}
                                    onClick={() => toggleProduct(product._id)}
                                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${isSelected ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            {product.images?.[0] && (
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{product.name}</h4>
                                            <p className="text-xs text-gray-400">{product.category?.name || 'Uncategorized'}</p>
                                        </div>
                                    </div>
                                    <div className={isSelected ? 'text-black' : 'text-gray-200'}>
                                        {isSelected ? <CheckCircle2 size={24} fill="currentColor" className="text-black" /> : <Circle size={24} />}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            No products found matching "{search}"
                        </div>
                    )}
                </div>

                {error && (
                    <div className="px-6 py-3 bg-red-50 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                        {assignedIds.length} products selected
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-black text-white px-8 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
                        >
                            {saving && <Loader2 size={16} className="animate-spin" />}
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
