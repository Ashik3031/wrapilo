'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CategoryFormProps {
    initialData?: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CategoryForm({ initialData, isOpen, onClose, onSuccess }: CategoryFormProps) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [parent, setParent] = useState('');
    const [categories, setCategories] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Fetch categories for parent selection
    useEffect(() => {
        if (isOpen) {
            fetch('/api/categories')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Filter out current category if editing to prevent self-parenting
                        const validParents = initialData
                            ? data.data.filter((c: any) => c._id !== initialData._id)
                            : data.data;
                        setCategories(validParents);
                    }
                })
                .catch(console.error);
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setSlug(initialData.slug);
            setDescription(initialData.description || '');
            setImage(initialData.image || '');
            setParent(initialData.parent ? (typeof initialData.parent === 'object' ? initialData.parent._id : initialData.parent) : '');
        } else {
            setName('');
            setSlug('');
            setDescription('');
            setImage('');
            setParent('');
        }
        setError('');
    }, [initialData, isOpen]);

    // Auto-generate slug from name
    useEffect(() => {
        if (!initialData && name) {
            setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    }, [name, initialData]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to upload image');
            }

            setImage(data.url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const url = initialData
            ? `/api/categories/${initialData._id}`
            : '/api/categories';

        const method = initialData ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    slug,
                    description,
                    image,
                    parent: parent || null
                }),
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

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Category' : 'Add New Category'}</h2>
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

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Slug</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Parent Category (Optional)</label>
                        <select
                            value={parent}
                            onChange={(e) => setParent(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                        >
                            <option value="">None (Main Category)</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Category Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors hover:bg-gray-50 text-center">
                            {image ? (
                                <div className="relative aspect-video w-full overflow-hidden rounded-md mb-2 group">
                                    <Image
                                        src={image}
                                        alt="Preview"
                                        width={400}
                                        height={300}
                                        className="object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImage('')}
                                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4">
                                    {uploading ? (
                                        <Loader2 size={24} className="animate-spin text-gray-400" />
                                    ) : (
                                        <>
                                            <Upload size={24} className="text-gray-400" />
                                            <span className="text-sm text-gray-500">Click to upload image</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            )}
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
                            disabled={loading || uploading}
                            className="px-6 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md flex items-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {initialData ? 'Save Changes' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
