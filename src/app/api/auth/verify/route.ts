import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({ success: false, error: 'Phone and OTP are required' }, { status: 400 });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (user.otp !== otp) {
            return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 400 });
        }

        if (user.otpExpires && user.otpExpires < new Date()) {
            return NextResponse.json({ success: false, error: 'OTP expired' }, { status: 400 });
        }

        // Clear OTP and mark verified
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true;
        await user.save();

        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        console.error('OTP verification error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
    }
}
