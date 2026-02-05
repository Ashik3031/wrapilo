'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ProductFormProps {
    initialData?: any;
    categories: any[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProductForm({ initialData, categories, isOpen, onClose, onSuccess }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        compareAtPrice: '',
        category: '',
        subcategory: '',
        description: '',
        tags: '',
        inventory: '0',
        status: 'active',
        isFeatured: false,
        seoTitle: '',
        seoDescription: '',
        images: [] as string[]
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);

    // Reset or fill form
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                price: initialData.price?.toString() || '',
                compareAtPrice: initialData.compareAtPrice?.toString() || '',
                category: (initialData.category && typeof initialData.category === 'object') ? initialData.category._id : initialData.category || '',
                subcategory: (initialData.subcategory && typeof initialData.subcategory === 'object') ? initialData.subcategory._id : initialData.subcategory || '',
                description: initialData.description || '',
                tags: initialData.tags?.join(', ') || '',
                inventory: initialData.inventory?.toString() || '0',
                status: initialData.status || 'active',
                isFeatured: initialData.isFeatured || false,
                seoTitle: initialData.seo?.title || '',
                seoDescription: initialData.seo?.description || '',
                images: initialData.images && initialData.images.length > 0 ? initialData.images : []
            });
        } else {
            setFormData({
                name: '',
                price: '',
                compareAtPrice: '',
                category: categories.length > 0 ? categories[0]._id : '',
                subcategory: '',
                description: '',
                tags: '',
                inventory: '0',
                status: 'active',
                isFeatured: false,
                seoTitle: '',
                seoDescription: '',
                images: []
            });
        }
        setError('');
    }, [initialData, categories, isOpen]);

    // Update available subcategories when category changes
    useEffect(() => {
        if (formData.category) {
            // Filter categories where parent matches selected category
            const subcats = categories.filter(c =>
                c.parent && (typeof c.parent === 'object' ? c.parent._id === formData.category : c.parent === formData.category)
            );
            setAvailableSubcategories(subcats);

            // Clear subcategory if it's no longer valid
            if (formData.subcategory && !subcats.find(s => s._id === formData.subcategory)) {
                setFormData(prev => ({ ...prev, subcategory: '' }));
            }
        } else {
            setAvailableSubcategories([]);
        }
    }, [formData.category, categories]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (formData.images.length + files.length > 4) {
            setError('You can upload a maximum of 4 images.');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const newImages: string[] = [];

            // Upload each file
            for (let i = 0; i < files.length; i++) {
                const formDataUpload = new FormData();
                formDataUpload.append('file', files[i]);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });

                const data = await res.json();

                if (!data.success) {
                    throw new Error(data.error || 'Failed to upload image');
                }
                newImages.push(data.url);
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));

        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
            // Reset input value to allow selecting same file again if needed
            e.target.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.images.length === 0) {
            setError('Please upload at least one product image.');
            setLoading(false);
            return;
        }

        const url = initialData
            ? `/api/products/${initialData._id}`
            : '/api/products';

        const method = initialData ? 'PUT' : 'POST';

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
                inventory: parseInt(formData.inventory),
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
                seo: {
                    title: formData.seoTitle,
                    description: formData.seoDescription
                },
                slug: initialData?.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                subcategory: formData.subcategory || null
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Something went wrong');
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Filter main categories only (no parent)
    const mainCategories = categories.filter(c => !c.parent);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Image Upload Grid */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Product Images ({formData.images.length}/4) <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-4">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                    <Image
                                        src={img}
                                        alt={`Product ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-red-500 hover:text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}

                            {formData.images.length < 4 && (
                                <label className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                    {uploading ? (
                                        <Loader2 size={24} className="animate-spin text-gray-400" />
                                    ) : (
                                        <>
                                            <Upload size={24} className="text-gray-400 mb-2" />
                                            <span className="text-xs text-gray-500 font-medium">Add Image</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                {mainCategories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Subcategory - Optional & Dynamic */}
                    {availableSubcategories.length > 0 && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Subcategory (Optional)</label>
                            <select
                                value={formData.subcategory}
                                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                            >
                                <option value="">None</option>
                                {availableSubcategories.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                required
                                min="0"
                                step="any"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Compare at Price</label>
                            <input
                                type="number"
                                value={formData.compareAtPrice}
                                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                min="0"
                                step="any"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Inventory</label>
                            <input
                                type="number"
                                value={formData.inventory}
                                onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                placeholder="Summer, Gift, New"
                            />
                        </div>
                    </div>

                    {/* Featured Checkbox */}
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            className="w-4 h-4 rounded text-black focus:ring-black"
                        />
                        <label htmlFor="isFeatured" className="text-sm font-medium text-gray-900 cursor-pointer">
                            ⭐ Featured Product (Show in Trending Section)
                        </label>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none min-h-[80px]"
                        />
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                        <h3 className="text-sm font-bold mb-3 text-gray-900">Search Engine Optimization (SEO)</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">SEO Title</label>
                                <input
                                    type="text"
                                    value={formData.seoTitle}
                                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                    placeholder="Product title for search engines"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">SEO Description</label>
                                <textarea
                                    value={formData.seoDescription}
                                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none min-h-[60px]"
                                    placeholder="Product summary for search engines"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md flex items-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {initialData ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
