import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number; // Base price in primary currency (e.g., USD)
    compareAtPrice?: number;
    images: string[];
    categories: mongoose.Types.ObjectId[];
    tags: string[];
    inventory: number;
    seo: {
        title: string;
        description: string;
    };
    status: 'active' | 'draft' | 'archived';
    isActive: boolean;
    isFeatured: boolean;
    variants?: Array<{
        name: string;
        options: string[];
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        compareAtPrice: { type: Number },
        images: { type: [String], required: true },
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
        tags: { type: [String], default: [] },
        inventory: { type: Number, default: 0 },
        seo: {
            title: { type: String, default: '' },
            description: { type: String, default: '' }
        },
        status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        variants: [{
            name: String,
            options: [String]
        }],
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite on hot reload - force refresh to include subcategory support
if (mongoose.models.Product) {
    delete mongoose.models.Product;
}
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
