import { Injectable } from "@angular/core";

import { environment } from "@environments/environment";

const baseUrl = `${environment.apiUrl}/api/recipes`;

@Injectable({ providedIn: 'root' })
export class CommentService {
    
}