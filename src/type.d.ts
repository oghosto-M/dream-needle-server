import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface CustomJwtPayload extends JwtPayload {
    id: string,
    role: number,
}
export type user = {
    _id?: mongoose.Types.ObjectId,
    name: string,
    lastname: string,
    role: number,
    email: string,
    phone: string,
    address: string,
    email_verify: boolean,
    phone_verify: boolean,
    updatedAt: Date,
    createdAt: Date,
} | null