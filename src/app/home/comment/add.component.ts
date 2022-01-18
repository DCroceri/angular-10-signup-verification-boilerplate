import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';
import {Location} from '@angular/common';

import { RecipeService, AlertService } from '@app/_services';
import { Recipe } from '@app/_models';

@Component({ templateUrl: 'add.component.html' })
export class AddComponent implements OnInit {
    recipe: Recipe;
    comments: Comment[];
    form: FormGroup;
    id: number;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private alertService: AlertService,
        private _location: Location
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.form = this.formBuilder.group({
            commentText: ['', Validators.required]
        });

        this.recipeService.getById(this.id)
            .pipe(map((x:any) => {this.recipe = x; this.comments = x.comments}))
            .subscribe();

    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.addComment();
    }

    private addComment() {
        this.recipeService.addComment(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Comment added successfully', { keepAfterRouteChange: true });
                    this.cancel();
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    cancel() {
        this._location.back();
    }
}