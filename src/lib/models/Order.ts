import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    customer: {
        name: string;
        phone: string;
        email?: string;
        address: string;
        city: string;
        country: string;
    };
    items: Array<{
        product: mongoose.Types.ObjectId;
        name: string;
        price: number;
        quantity: number;
        image?: string;
    }>;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: 'COD'; // Currently only COD
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        customer: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String },
            address: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true },
        },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                image: { type: String },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['COD'],
            default: 'COD',
        },
    },
    {
        timestamps: true,
    }
);

if (mongoose.models.Order) {
    delete mongoose.models.Order;
}

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
