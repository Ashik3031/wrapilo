import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHomeSection extends Document {
    title: string;
    type: 'subcategories' | 'products' | 'featured';
    category: mongoose.Types.ObjectId;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const HomeSectionSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        type: { type: String, enum: ['subcategories', 'products', 'featured'], required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite on hot reload
if (mongoose.models.HomeSection) {
    delete mongoose.models.HomeSection;
}
const HomeSection: Model<IHomeSection> = mongoose.model<IHomeSection>('HomeSection', HomeSectionSchema);

export default HomeSection;
