import { Component, OnInit, ViewChild } from '@angular/core';

import { Role } from '@app/_models';
import { AccountService, RecipeService, UserService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    Role = Role;
    account = this.accountService.accountValue;
    user = this.userService.userValue;
    recipes: any[];

    constructor(
        private accountService: AccountService,
        private userService: UserService,
        private recipeService: RecipeService) { }
    
    ngOnInit() {
        this.recipeService.getAll()
            .pipe(first())
            .subscribe(recipes => this.recipes = recipes);
    }

    deleteRecipe(id: number) {
        const recipe = this.recipes.find(x => x.id === id);
        recipe.isDeleting = true;
        this.recipeService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.recipes = this.recipes.filter(x => x.id !== id) 
            });
    }
    @ViewChild('search') private search: { nativeElement: { value: string; }; };
    searchTags () {
        this.recipeService.search(this.search.nativeElement.value.split(','))
            .pipe(first())
            .subscribe(recipes => this.recipes = recipes);
    }
}