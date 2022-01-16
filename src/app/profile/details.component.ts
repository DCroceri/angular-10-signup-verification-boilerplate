import { Component } from '@angular/core';

import { AccountService, UserService } from '@app/_services';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent {
    account = this.accountService.accountValue;
    user = this.userService.userValue;

    constructor(private accountService: AccountService, private userService: UserService) { }
}