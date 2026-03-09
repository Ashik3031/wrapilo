import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import HeroSection from '@/lib/models/HeroSection';

export async function GET() {
    try {
        await connectDB();
        // Since it's a singleton conceptual model, we just get the first one
        let heroConfig = await HeroSection.findOne();

        if (!heroConfig) {
            // Create default if it doesn't exist
            heroConfig = await HeroSection.create({});
        }

        return NextResponse.json({ success: true, data: heroConfig });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Get the single hero config or create it
        let heroConfig = await HeroSection.findOne();

        if (heroConfig) {
            heroConfig = await HeroSection.findByIdAndUpdate(heroConfig._id, body, { new: true });
        } else {
            heroConfig = await HeroSection.create(body);
        }

        return NextResponse.json({ success: true, data: heroConfig });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
