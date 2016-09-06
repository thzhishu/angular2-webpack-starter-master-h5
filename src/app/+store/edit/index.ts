import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StoreEditComponent } from './edit.component';
import { SFMModule } from '../form/sfm.module';

export const routes = [
    { path: '', component: StoreEditComponent, pathMatch: 'full' }
];

@NgModule({
    declarations: [ StoreEditComponent ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(routes),
        SFMModule
    ]
})

export default class StoreEditModule {
    static routes = routes;
}
