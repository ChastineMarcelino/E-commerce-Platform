// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    userID: string;
    firstname?: string;
    lastname?: string;
    contact?: string;
}

const UserSchema = new Schema<IUser>({
    userID: { type: String, required: true, unique: true },
    firstname: { type: String },
    lastname: { type: String },
    contact: { type: String },
});

export const User = mongoose.model<IUser>('User', UserSchema);