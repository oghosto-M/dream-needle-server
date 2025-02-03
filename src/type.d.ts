export interface CustomJwtPayload extends JwtPayload {
    id: string;
    role: number;
}
export interface user {
    name: string
    lastname: string
    role: number
    email: string
    phone: string
    address: string
    phone_verify: string
    email_verify: string
}