'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseShopifyCSV } from '@/lib/utils/shopifyParser';

interface BulkUploadProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BulkUpload({ isOpen, onClose, onSuccess }: BulkUploadProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const text = await file.text();
            const products = parseShopifyCSV(text);

            if (products.length === 0) {
                throw new Error('No products found in the CSV file.');
            }

            const res = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to upload products.');
            }

            setSuccess(`Successfully imported ${data.count} products!`);
            onSuccess();
            // Close after 2 seconds
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold">Bulk Import from Shopify</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4 flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md mb-4 flex items-center gap-2">
                            <CheckCircle2 size={16} />
                            {success}
                        </div>
                    )}

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${loading ? 'bg-gray-50 border-gray-200 pointer-events-none' : 'hover:bg-gray-50 border-gray-200'}`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin text-black" size={32} />
                        ) : (
                            <Upload className="text-gray-400" size={32} />
                        )}
                        <div className="text-center">
                            <p className="font-medium text-gray-900">Click to upload Shopify CSV</p>
                            <p className="text-sm text-gray-500 mt-1">Maximum file size 5MB</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </div>

                    <div className="mt-6 text-xs text-gray-400">
                        <p>Format: Handle, Title, Body (HTML), Tags, Variant Price, Image Src, etc.</p>
                        <p className="mt-1">Categories will be created automatically if they don't exist.</p>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
