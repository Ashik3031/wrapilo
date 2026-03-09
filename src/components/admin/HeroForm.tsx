'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface HeroFormProps {
    initialData?: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function HeroForm({ initialData, isOpen, onClose, onSuccess }: HeroFormProps) {
    const [tagline, setTagline] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [primaryButtonText, setPrimaryButtonText] = useState('');
    const [primaryButtonLink, setPrimaryButtonLink] = useState('');
    const [secondaryButtonText, setSecondaryButtonText] = useState('');
    const [secondaryButtonLink, setSecondaryButtonLink] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setTagline(initialData.tagline || '');
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setPrimaryButtonText(initialData.primaryButtonText || '');
            setPrimaryButtonLink(initialData.primaryButtonLink || '');
            setSecondaryButtonText(initialData.secondaryButtonText || '');
            setSecondaryButtonLink(initialData.secondaryButtonLink || '');
            setBackgroundImage(initialData.backgroundImage || '');
        }
        setError('');
    }, [initialData, isOpen]);

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

            setBackgroundImage(data.url);
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

        try {
            const res = await fetch('/api/hero', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tagline,
                    title,
                    description,
                    primaryButtonText,
                    primaryButtonLink,
                    secondaryButtonText,
                    secondaryButtonLink,
                    backgroundImage
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
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold">Edit Hero Section</h2>
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
                        <label className="text-sm font-medium text-gray-700">Tagline</label>
                        <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="e.g. Celebration of Love"
                            className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Title (HTML allowed)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Make This Valentine's <br/> <span class='text-secondary'>Unforgettable</span>"
                            className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none min-h-[80px]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Primary Button Text</label>
                            <input
                                type="text"
                                value={primaryButtonText}
                                onChange={(e) => setPrimaryButtonText(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Primary Button Link</label>
                            <input
                                type="text"
                                value={primaryButtonLink}
                                onChange={(e) => setPrimaryButtonLink(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Secondary Button Text</label>
                            <input
                                type="text"
                                value={secondaryButtonText}
                                onChange={(e) => setSecondaryButtonText(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Secondary Button Link</label>
                            <input
                                type="text"
                                value={secondaryButtonLink}
                                onChange={(e) => setSecondaryButtonLink(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Background Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors hover:bg-gray-50 text-center">
                            {backgroundImage ? (
                                <div className="relative aspect-video w-full overflow-hidden rounded-md mb-2 group">
                                    <Image
                                        src={backgroundImage}
                                        alt="Preview"
                                        width={800}
                                        height={450}
                                        className="object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setBackgroundImage('')}
                                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-8">
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

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 sticky bottom-0 bg-white">
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
                            Save Hero Config
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
