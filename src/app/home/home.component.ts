import { Component } from '@angular/core';

import { AccountService, UserService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    account = this.accountService.accountValue;
    user = this.userService.userValue;

    constructor(private accountService: AccountService, private userService: UserService) { }

}