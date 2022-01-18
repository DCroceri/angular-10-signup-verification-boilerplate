import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Recipe } from '@app/_models';
import { AccountService, RecipeService, UserService } from '@app/_services';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService,
        private userService: UserService,
        private recipeService: RecipeService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const account = this.accountService.accountValue;
        const user = this.userService.userValue;
        

        if (account) {
            // check if route is restricted by role
            if (route.data.roles && !route.data.roles.includes(account.role)) {
                // role not authorized so redirect to home page
                this.router.navigate(['/']);
                return of(false);
            }
            // check if route is restricted for chef by user id
            if (user && route.data.verifyAuthor) {
                return this.recipeService.getById(route.params.id)
                        .pipe(map(recipe => {
                                if (recipe.author.id !== user.id) {
                                    this.router.navigate(['/my-recipes']);
                                    return false;
                                }
                                return true;
                            }),
                            catchError(error => {
                                this.router.navigate(['/my-recipes']);
                                return of(false);
                            })
                        );
            }

            // authorized so return true
            return of(true);
        }

        // not logged in so redirect to login page with the return url 
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return of(false);
    }

}