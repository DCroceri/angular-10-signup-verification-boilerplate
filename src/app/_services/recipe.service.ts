import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "@app/_models";

import { environment } from "@environments/environment";

const baseUrl = `${environment.apiUrl}/api/recipes`;

@Injectable({ providedIn: 'root' })
export class RecipeService {

    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<Recipe[]>(`${baseUrl}/`, { withCredentials: true });
    }
    getById(id: number) {
        return this.http.get<Recipe>(`${baseUrl}/${id}/`, { withCredentials: true });
    }
    getMyRecipes(userid: number) {
        return this.http.get<Recipe[]>(`${baseUrl}/author/${userid}`, { withCredentials: true });
    }

    create(recipe: Recipe) {
        return this.http.post(`${baseUrl}/`, recipe, { withCredentials: true });
    }
    update(id: number, recipe: Recipe) {
        return this.http.put<Recipe>(`${baseUrl}/${id}`, recipe, { withCredentials: true });
    }
    delete(id: number) {
        return this.http.delete(`${baseUrl}/${id}`, { withCredentials: true });
    }

    search(keywords: string[]) {
        const params = { keywords: keywords };
        return this.http.post<Recipe[]>(`${baseUrl}/keywords`, params, { withCredentials: true });
    }

    /** COMMENTS */
    addComment(id: number, comment: Comment) {
        return this.http.post(`${baseUrl}/${id}/comments`, comment, { withCredentials: true })
    }
}