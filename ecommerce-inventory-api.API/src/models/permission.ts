// src/models/Permissions.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IPermission extends Document {
    id: string;
    name: string;
    description: string;
    action: string;
    resource: string;
    is_active: boolean;
}

const PermissionSchema = new Schema<IPermission>(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        action: { type: String, required: true },
        resource: { type: String, required: true },
        is_active: { type: Boolean, required: true, default: true },
    },
    { timestamps: true }
);

export const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);