import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ChefRoutingModule } from './chef-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ChefRoutingModule
    ],
    declarations: [
        ListComponent,
        AddEditComponent
    ]
})
export class ChefModule { }