import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
        }

        // Generate 4 digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Find or create user
        let user = await User.findOne({ phone });
        if (!user) {
            user = await User.create({ phone });
        }

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // In a real app, send SMS here. For now, log to console.
        console.log(`OTP for ${phone}: ${otp}`);

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('OTP request error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
    }
}
