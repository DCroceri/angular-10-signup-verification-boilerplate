import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { RecipeService, UserService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    recipes: any[];
    user = this.userService.userValue;

    constructor(private recipeService: RecipeService, private userService: UserService) {}

    ngOnInit() {
        this.recipeService.getMyRecipes(this.user.id)
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

}