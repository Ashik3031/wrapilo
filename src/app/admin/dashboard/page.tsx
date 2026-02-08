'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, Edit, Package, Layers, Loader2, Upload, LogOut, Layout } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import ProductForm from '@/components/admin/ProductForm';
import CategoryForm from '@/components/admin/CategoryForm';
import CategoryProductManager from '@/components/admin/CategoryProductManager';
import BulkUpload from '@/components/admin/BulkUpload';
import HomeSectionForm from '@/components/admin/HomeSectionForm';

interface Product {
    _id: string;
    name: string;
    price: number;
    categories: Array<{ _id: string; name: string } | string>;
    description: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface HomeSection {
    _id: string;
    title: string;
    type: 'subcategories' | 'products';
    category: { _id: string; name: string } | string;
    order: number;
    isActive: boolean;
}

// ... (Define Order Interface)

interface Order {
    _id: string;
    orderId: string;
    customer: {
        name: string;
        phone: string;
        address: string;
        city: string;
        country: string;
    };
    items: Array<{
        product: { _id: string; name: string };
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
}

// ... existing interfaces ...

export default function AdminDashboard() {
    const router = useRouter();
    const { formatPrice } = useCurrency();
    const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'home-layout' | 'orders'>('products');

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
    const [orders, setOrders] = useState<Order[]>([]); // New Order State
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isProductFormOpen, setProductFormOpen] = useState(false);
    const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
    const [isCategoryProductManagerOpen, setCategoryProductManagerOpen] = useState(false);
    const [isHomeSectionFormOpen, setHomeSectionFormOpen] = useState(false);
    const [isBulkUploadOpen, setBulkUploadOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Checks auth
    useEffect(() => {
        if (!document.cookie.includes('admin_auth=true')) {
            router.push('/admin/login');
        }
    }, [router]);

    // Logout Helper
    const handleLogout = () => {
        document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push('/admin/login');
    };

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'products') {
                // ... existing product fetch
                const [prodRes, catRes] = await Promise.all([
                    fetch('/api/products', { cache: 'no-store' }),
                    fetch('/api/categories', { cache: 'no-store' })
                ]);
                const prodData = await prodRes.json();
                const catData = await catRes.json();
                if (prodData.success) setProducts(prodData.data);
                if (catData.success) setCategories(catData.data);
            } else if (activeTab === 'categories') {
                // ... existing category fetch
                const res = await fetch('/api/categories', { cache: 'no-store' });
                const data = await res.json();
                if (data.success) setCategories(data.data);
            } else if (activeTab === 'home-layout') {
                // ... existing home layout fetch
                const [secRes, catRes] = await Promise.all([
                    fetch('/api/home-sections', { cache: 'no-store' }),
                    fetch('/api/categories', { cache: 'no-store' })
                ]);
                const secData = await secRes.json();
                const catData = await catRes.json();
                if (secData.success) setHomeSections(secData.data);
                if (catData.success) setCategories(catData.data);
            } else if (activeTab === 'orders') {
                const res = await fetch('/api/orders', { cache: 'no-store' });
                const data = await res.json();
                if (data.success) setOrders(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    // CRUD Handlers
    const handleAddNew = () => {
        setEditingItem(null);
        if (activeTab === 'products') setProductFormOpen(true);
        else if (activeTab === 'categories') setCategoryFormOpen(true);
        else setHomeSectionFormOpen(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        if (activeTab === 'products') setProductFormOpen(true);
        else if (activeTab === 'categories') setCategoryFormOpen(true);
        else setHomeSectionFormOpen(true);
    };

    const handleManageProducts = (item: Category) => {
        setEditingItem(item);
        setCategoryProductManagerOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        let endpoint = '';
        if (activeTab === 'products') endpoint = `/api/products/${id}`;
        else if (activeTab === 'categories') endpoint = `/api/categories/${id}`;
        else endpoint = `/api/home-sections/${id}`;

        try {
            const res = await fetch(endpoint, { method: 'DELETE' });
            if (res.ok) {
                fetchData(); // Refresh list
            } else {
                alert('Failed to delete item');
            }
        } catch (error) {
            console.error('Delete error', error);
        }
    };

    // Order Status Update Handler
    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                // Update local state instead of full fetch for smoothness
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Update status error', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header ... */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-xl">W</div>
                    <h1 className="text-xl font-bold tracking-tight">Wrapilo<span className="text-gray-400">Admin</span></h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 font-semibold transition-colors bg-gray-50 px-4 py-2 rounded-full"
                >
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-100 p-6 hidden md:flex flex-col">
                    <nav className="space-y-1.5 flex-1">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'products' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <Package size={18} /> Products
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'categories' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <Layers size={18} /> Categories
                        </button>
                        <button
                            onClick={() => setActiveTab('home-layout')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'home-layout' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <Layout size={18} /> Home Layout
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <Package size={18} /> Orders {/* Reusing Package icon or maybe ListOrdered if available */}
                        </button>
                    </nav>

                    <div className="mt-auto pt-6 border-t border-gray-100 italic text-xs text-gray-400 text-center">
                        Wrapilo Admin v1.0
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                {activeTab === 'products' ? 'Product Inventory' :
                                    activeTab === 'categories' ? 'Gifting Categories' :
                                        activeTab === 'home-layout' ? 'Home Page Layout' :
                                            'Order Management'}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Manage and organize your store content</p>
                        </div>
                        <div className="flex items-center gap-3 whitespace-nowrap">
                            {activeTab === 'products' && (
                                <button
                                    onClick={() => setBulkUploadOpen(true)}
                                    className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <Upload size={18} /> Bulk Upload
                                </button>
                            )}
                            {activeTab !== 'orders' && (
                                <button
                                    onClick={handleAddNew}
                                    className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                                >
                                    <Plus size={18} /> {activeTab === 'home-layout' ? 'Add Section' : 'Add New'}
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96 gap-4">
                            <Loader2 className="animate-spin text-gray-300" size={48} />
                            <p className="text-gray-400 font-medium animate-pulse">Loading data...</p>
                        </div>
                    ) : activeTab === 'products' ? (
                        // ... product table
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px] font-black">
                                    <tr>
                                        <th className="px-8 py-5">Product Name</th>
                                        <th className="px-8 py-5">Category</th>
                                        <th className="px-8 py-5">Price</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.length > 0 ? products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-gray-900">{product.name}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.isArray(product.categories) && product.categories.length > 0 ? (
                                                        product.categories.slice(0, 2).map((cat: any, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold">
                                                                {typeof cat === 'object' ? cat.name : 'Category'}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-[10px]">Uncategorized</span>
                                                    )}
                                                    {Array.isArray(product.categories) && product.categories.length > 2 && (
                                                        <span className="text-[10px] text-gray-400 font-bold">+{product.categories.length - 2} more</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-black text-gray-900">{formatPrice(product.price)}</div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(product)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Edit size={14} /></button>
                                                    <button onClick={() => handleDelete(product._id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">No products found. Start by adding one!</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === 'categories' ? (
                        // ... category table
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px] font-black">
                                    <tr>
                                        <th className="px-8 py-5">Category Name</th>
                                        <th className="px-8 py-5 text-center">Products</th>
                                        <th className="px-8 py-5">URL Slug</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {categories.length > 0 ? categories.map((cat) => (
                                        <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5 font-bold text-gray-900">{cat.name}</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className="font-black text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                                    {(cat as any).productCount || 0}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 font-mono text-gray-400 text-xs">{cat.slug}</td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleManageProducts(cat)}
                                                        title="Manage Products"
                                                        className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase"
                                                    >
                                                        <Package size={12} /> Products
                                                    </button>
                                                    <button onClick={() => handleEdit(cat)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Edit size={14} /></button>
                                                    <button onClick={() => handleDelete(cat._id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-medium">No categories found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === 'home-layout' ? (
                        // ... home layout table
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px] font-black">
                                    <tr>
                                        <th className="px-8 py-5">Section Title</th>
                                        <th className="px-8 py-5">Type</th>
                                        <th className="px-8 py-5">Source Category</th>
                                        <th className="px-8 py-5">Order</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {homeSections.length > 0 ? homeSections.map((sec) => (
                                        <tr key={sec._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5 font-bold text-gray-900">{sec.title}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${sec.type === 'subcategories' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                                                    {sec.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-gray-500 font-medium">
                                                {typeof sec.category === 'object' ? sec.category?.name : 'Unknown'}
                                            </td>
                                            <td className="px-8 py-5 text-gray-900 font-black">{sec.order}</td>
                                            <td className="px-8 py-5">
                                                <span className={`w-2 h-2 rounded-full inline-block mr-2 ${sec.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                                <span className="text-[11px] font-bold text-gray-500 uppercase">{sec.isActive ? 'Active' : 'Hidden'}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(sec)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Edit size={14} /></button>
                                                    <button onClick={() => handleDelete(sec._id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium">No home sections configured. Add one to customize your home page!</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // ORDERS TABLE
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px] font-black">
                                    <tr>
                                        <th className="px-8 py-5">Order ID</th>
                                        <th className="px-8 py-5">Customer</th>
                                        <th className="px-8 py-5">Total</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5 text-right">Items</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.length > 0 ? orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5 font-mono text-xs text-gray-500">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-bold">#{order.orderId || order._id.slice(-6).toUpperCase()}</span>
                                                    <span className="text-[10px] text-gray-400">{order.paymentMethod}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-gray-900">{order.customer.name}</div>
                                                <div className="text-xs text-gray-500">{order.customer.phone}</div>
                                                <div className="text-[10px] text-gray-400 truncate max-w-[150px]">{order.customer.city}, {order.customer.country}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-black text-gray-900">{formatPrice(order.totalAmount)}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                    className={`px-2 py-1 rounded-md text-[10px] font-black uppercase border-none focus:ring-2 focus:ring-black outline-none cursor-pointer ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                                                        order.status === 'processing' ? 'bg-blue-50 text-blue-600' :
                                                            order.status === 'shipped' ? 'bg-purple-50 text-purple-600' :
                                                                order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                                                                    'bg-gray-50 text-gray-600'
                                                        }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="text-xs font-medium text-gray-900">
                                                    {order.items.length} items
                                                </div>
                                                <div className="text-[10px] text-gray-500">
                                                    {order.items[0]?.product?.name} {order.items.length > 1 && `+${order.items.length - 1} more`}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium">No orders found yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Modals ... */}
                    <ProductForm
                        isOpen={isProductFormOpen}
                        onClose={() => setProductFormOpen(false)}
                        initialData={editingItem}
                        categories={categories}
                        onSuccess={fetchData}
                    />
                    <CategoryForm
                        isOpen={isCategoryFormOpen}
                        onClose={() => setCategoryFormOpen(false)}
                        initialData={editingItem}
                        onSuccess={fetchData}
                    />
                    <CategoryProductManager
                        isOpen={isCategoryProductManagerOpen}
                        onClose={() => setCategoryProductManagerOpen(false)}
                        category={editingItem}
                        onSuccess={fetchData}
                    />
                    <HomeSectionForm
                        isOpen={isHomeSectionFormOpen}
                        onClose={() => setHomeSectionFormOpen(false)}
                        initialData={editingItem}
                        categories={categories}
                        onSuccess={fetchData}
                    />
                    <BulkUpload
                        isOpen={isBulkUploadOpen}
                        onClose={() => setBulkUploadOpen(false)}
                        onSuccess={fetchData}
                    />

                </main>
            </div>
        </div>
    );
}
