import { Role } from './role';

export class User {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    role: Role;
}