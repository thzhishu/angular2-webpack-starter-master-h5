import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StoreInitComponent } from './init.component';
import { SFMModule } from '../form/sfm.module';

export const routes = [
    { path: '', component: StoreInitComponent, pathMatch: 'full' }
];

@NgModule({
    declarations: [ StoreInitComponent ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(routes),
        SFMModule
    ]
})

export default class StoreListModule {
    static routes = routes;
}
