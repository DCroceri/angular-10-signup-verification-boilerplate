import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';

const baseUrl = `${environment.apiUrl}/api/users`;

@Injectable({ providedIn: 'root' })
export class UserService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private accountService: AccountService,
        private http: HttpClient) {
        this.userSubject = new BehaviorSubject<User>(null);
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }
    getUser() {
        return this.accountService.whoami()
            .pipe(map(user => {
                this.userSubject.next(user);
                return user;
            }));
    }

    getAll() {
        return this.http.get<User[]>(`${baseUrl}`, { withCredentials: true});
    }
    getById(id: number) {
        return this.http.get<User>(`${baseUrl}/${id}`, { withCredentials: true});
    }
    create(user: User) {
        return this.http.post(`${baseUrl}/`, user, { withCredentials: true });
    }
    update(id: number, user: User) {
        return this.http.put<User>(`${baseUrl}/${id}`, user, { withCredentials: true });
    }
    delete(id: number) {
        return this.http.delete(`${baseUrl}/${id}`, { withCredentials: true });
    }
}