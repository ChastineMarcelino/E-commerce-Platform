// src/models/Roles.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IRoles extends Document {
    role_id: string;
    manager: boolean;
    cashier: boolean;
    guess_user: boolean;
}

const RoleSchema = new Schema<IRoles>({
    role_id: { type: String, required: true, unique: true },
    manager: { type: Boolean, required: true },
    cashier: { type: Boolean, required: true },
    guess_user: { type: Boolean, required: true },
});

export const Role = mongoose.model<IRoles>('Role', RoleSchema);