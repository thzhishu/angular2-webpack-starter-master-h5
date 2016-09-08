import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StoreAddComponent } from './add.component';
import { SFMModule } from '../form/sfm.module';

export const routes = [
    { path: '', component: StoreAddComponent, pathMatch: 'full' }
];

@NgModule({
    declarations: [ StoreAddComponent ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SFMModule
    ]
})

export default class StoreAddModule {
    static routes = routes;
}
