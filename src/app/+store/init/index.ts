import { CommonModule } from '@angular/common';
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
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SFMModule
    ]
})

export default class StoreInitModule {
    static routes = routes;
}
