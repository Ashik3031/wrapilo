import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    image?: string;
    description?: string;
    parent?: string | ICategory | null;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        image: { type: String },
        description: { type: String },
        parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite on hot reload - force refresh to include subcategory support
if (mongoose.models.Category) {
    delete mongoose.models.Category;
}
const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
