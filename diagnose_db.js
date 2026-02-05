const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://ashikofficial333_db_user:kyFtJWrgzKfLsla1@cluster0.psqgayy.mongodb.net/?appName=Cluster0";

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        image: { type: String },
        description: { type: String },
    },
    { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function test() {
    console.log('Connecting to DB...');
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        console.log('Attempting to create category...');
        const cat = await Category.create({
            name: 'Test Node Script',
            slug: 'test-node-script-' + Date.now()
        });
        console.log('Category created:', cat);

        console.log('Cleaning up...');
        await Category.findByIdAndDelete(cat._id);
        console.log('Deleted test category.');

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await mongoose.disconnect();
    }
}

test();
