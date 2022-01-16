import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/auth`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account {
        return this.accountSubject.value;
    }
    public get getJWTToken(): string {
        return (document.cookie.split(';').find(x => x.includes('jwtToken')) || '=').split('=')[1];
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${baseUrl}/login`, { username, password }, { withCredentials: true })
            .pipe(map(account => {
                this.accountSubject.next(account);
                const expires = new Date(Date.now() + account.expires_in*1000).toUTCString();
                document.cookie = `jwtToken=${account.jwtToken}; expires=${expires}; path=/`;
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    whoami() {
        return this.http.get<any>(`${baseUrl}/whoami`, { withCredentials: true });
    }

    logout() {
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        document.cookie = `jwtToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
        this.router.navigate(['/account/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${baseUrl}/refresh`, { }, { withCredentials: true })
            .pipe(map((account) => {
                if (account.jwtToken != undefined) {
                    this.accountSubject.next(account);
                    const expires = new Date(Date.now() + account.expires_in*1000).toUTCString();
                    document.cookie = `jwtToken=${account.jwtToken}; expires=${expires}; path=/`;
                    this.startRefreshTokenTimer();
                }
                return account;
            }));
    }

    register(account: Account) {
        return this.http.post(`${baseUrl}/signup`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }
    
    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }
    
    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }
    
    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }

    getAll() {
        return this.http.get<Account[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }
    
    create(params) {
        return this.http.post(baseUrl, params);
    }
    
    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                // if (account.id === this.accountValue.id) {
                //     // publish updated account to subscribers
                //     account = { ...this.accountValue, ...account };
                //     this.accountSubject.next(account);
                // }
                return account;
            }));
    }
    
    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                // if (id === this.userValue.id)
                //     this.logout();
            }));
    }

    // helper methods

    private refreshTokenTimeout;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}