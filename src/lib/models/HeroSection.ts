import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeroSection extends Document {
    tagline: string;
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    backgroundImage: string;
    createdAt: Date;
    updatedAt: Date;
}

const HeroSectionSchema: Schema = new Schema(
    {
        tagline: { type: String, required: true, default: "Celebration of Love" },
        title: { type: String, required: true, default: "Make This Valentine's <br className=\"hidden md:block\" /> <span className=\"text-secondary\">Unforgettable</span>" },
        description: { type: String, required: true, default: 'From elegant roses to personalized keepsakes, find the perfect way to say "I Love You".' },
        primaryButtonText: { type: String, required: true, default: "Shop Valentine's" },
        primaryButtonLink: { type: String, required: true, default: "/collections/valentines" },
        secondaryButtonText: { type: String, required: true, default: "View All Gifts" },
        secondaryButtonLink: { type: String, required: true, default: "/collections/all" },
        backgroundImage: { type: String, required: true, default: "/images/valentine_hero_v2.jpg" },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite on hot reload
if (mongoose.models.HeroSection) {
    delete mongoose.models.HeroSection;
}
const HeroSection: Model<IHeroSection> = mongoose.model<IHeroSection>('HeroSection', HeroSectionSchema);

export default HeroSection;
