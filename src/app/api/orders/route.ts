import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order from '@/lib/models/Order';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const { customer, items, totalAmount, paymentMethod } = body;

        // Basic validation
        if (!customer || !customer.name || !customer.phone || !customer.address) {
            return NextResponse.json({ success: false, error: 'Missing customer details' }, { status: 400 });
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, error: 'Order must contain items' }, { status: 400 });
        }

        // Create Order
        const order = await Order.create({
            customer,
            items,
            totalAmount,
            paymentMethod: paymentMethod || 'COD',
            status: 'pending'
        });

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error('Order creation error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find({})
            .populate('items.product', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: orders });
    } catch (error: any) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }
}
