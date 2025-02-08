
import { Document } from "mongoose";

// Define the Permission interface
export interface IPermission extends Document {
  // Unique identifier for the permission
  id: string;
  // Name of the permission
  name: string;
  // Description of the permission
  description: string;
  // Action associated with the permission (e.g., read, write, delete)
  action: string;
  // Resource associated with the permission (e.g., user, order)
  resource: string;
  // Boolean indicating if the permission is active
  is_active: boolean;
}
