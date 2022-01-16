import { User } from "./user";

export class Recipe {
    id: number;
    author: User;
    ingredients: string;
    keywords: string[];

}