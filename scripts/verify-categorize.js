const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

const CategorySchema = new mongoose.Schema({ name: String });
const ProductSchema = new mongoose.Schema({ name: String, categories: [mongoose.Schema.Types.ObjectId] });
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
    await mongoose.connect(MONGODB_URI);
    const products = await Product.find({ name: /Teddy/i }).populate('categories');

    products.forEach(p => {
        console.log(`Product: ${p.name}`);
        console.log(`Categories: ${p.categories.map(c => c.name).join(', ')}`);
        console.log('---');
    });

    await mongoose.disconnect();
}

run();
