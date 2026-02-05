const mongoose = require('mongoose');
const { Schema } = mongoose;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        image: { type: String },
        description: { type: String },
        parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    },
    { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const cats = await Category.find({});
        console.log("Categories found:", cats.length);
        cats.forEach(c => {
            console.log(`Name: ${c.name}, ID: ${c._id}, Parent: ${c.parent} (Type: ${typeof c.parent})`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
