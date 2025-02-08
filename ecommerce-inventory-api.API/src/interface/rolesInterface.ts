import { Document } from "mongoose";
// interfaces/rolesInterfaces.ts

export interface IRoles extends Document {
    role_id: string;
    manager: boolean;
    cashier: boolean;
    guess_user: boolean;
  }
  