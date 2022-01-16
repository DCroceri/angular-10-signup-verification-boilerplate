import { Component } from '@angular/core';

import { AccountService, UserService } from './_services';
import { Account, Role, User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    Role = Role;
    account: Account;
    user: User;

    constructor(private accountService: AccountService, private userService: UserService) {
        this.accountService.account.subscribe(x => this.account = x);
        this.userService.user.subscribe(x => this.user = x);
    }

    logout() {
        this.accountService.logout();
    }
}