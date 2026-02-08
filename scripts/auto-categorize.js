const mongoose = require('mongoose');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}

// Define Schemas (Simplified)
const CategorySchema = new mongoose.Schema({
    name: String,
    parent: mongoose.Schema.Types.ObjectId,
});

const ProductSchema = new mongoose.Schema({
    name: String,
    categories: [mongoose.Schema.Types.ObjectId],
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories`);

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    // Define rules: Array of keywords -> Category Name
    const rules = [
        { keywords: ['men', 'male', 'boy', 'husband', 'dad', 'groom', 'gentle'], categoryName: 'MEN' },
        { keywords: ['women', 'female', 'girl', 'wife', 'mom', 'lady', 'bride', 'her'], categoryName: 'Women' },
        { keywords: ['ramadan', 'iftar', 'eid', 'mubarak', 'kareem'], categoryName: 'Ramadan' },
        { keywords: ['valentine', 'heart', 'love', 'red', 'date', 'romantic'], categoryName: 'Valentne\'s Day' },
        { keywords: ['rose', 'bouquet', 'flower', 'floral', 'blossom'], categoryName: 'Flowers' },
        { keywords: ['rose'], categoryName: 'Rose Day' },
        { keywords: ['birthday', 'age', 'anniversary', 'celebrat', 'happy'], categoryName: 'Birthday' },
        { keywords: ['propose', 'ring', 'marry'], categoryName: 'Propose day' },
        { keywords: ['chocolate', 'choco', 'truffle', 'cacao', 'sweet'], categoryName: 'Chocolates' },
        { keywords: ['chocolate'], categoryName: 'Chocolate day' },
        { keywords: ['teddy', 'bear', 'soft toy', 'plush'], categoryName: 'Teddy day' },
        { keywords: ['promise', 'together', 'forever'], categoryName: 'Promise day' },
        { keywords: ['cake', 'bake', 'pastry', 'dessert'], categoryName: 'Cakes' },
        { keywords: ['hamper', 'box', 'set', 'combo', 'basket', 'collection'], categoryName: 'Hamper' },
    ];

    // Helper to find category IDs by product name
    const findCategoryIds = (productName) => {
        const foundIds = new Set();
        const lowerName = productName.toLowerCase();

        for (const rule of rules) {
            const matches = rule.keywords.some(kw => lowerName.includes(kw.toLowerCase()));
            if (matches) {
                // Find a category that matches the categoryName exactly (best) or partially
                const matchedCat = categories.find(c =>
                    c.name.toLowerCase() === rule.categoryName.toLowerCase()
                ) || categories.find(c =>
                    c.name.toLowerCase().includes(rule.categoryName.toLowerCase())
                );

                if (matchedCat) {
                    foundIds.add(matchedCat._id.toString());
                }
            }
        }
        return Array.from(foundIds);
    };

    let updatedCount = 0;
    let totalAssignments = 0;

    for (const product of products) {
        const suggestedCategories = findCategoryIds(product.name);

        if (suggestedCategories.length > 0) {
            const currentCategories = (product.categories || []).map(id => id.toString());

            // Filter out any invalid ObjectIds if they exist
            const validCurrent = currentCategories.filter(id => mongoose.Types.ObjectId.isValid(id));

            const newCategories = [...new Set([...validCurrent, ...suggestedCategories])];

            if (newCategories.length > validCurrent.length) {
                product.categories = newCategories;
                await product.save();
                updatedCount++;
                totalAssignments += (newCategories.length - validCurrent.length);
                console.log(`Updated: "${product.name}" -> Added ${newCategories.length - validCurrent.length} categories (Total: ${newCategories.length})`);
            }
        }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Products updated: ${updatedCount}`);
    console.log(`New category assignments: ${totalAssignments}`);

    await mongoose.disconnect();
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
