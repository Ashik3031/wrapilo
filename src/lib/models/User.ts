import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    phone: string;
    name?: string;
    email?: string;
    otp?: string;
    otpExpires?: Date;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        phone: { type: String, required: true, unique: true },
        name: { type: String },
        email: { type: String },
        otp: { type: String },
        otpExpires: { type: Date },
        isVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

if (mongoose.models.User) {
    delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
