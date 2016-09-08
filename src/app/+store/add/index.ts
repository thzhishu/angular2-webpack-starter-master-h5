import { BrowserModule } from '@angular/platform-browser';
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
        BrowserModule,
        FormsModule,
        RouterModule.forChild(routes),
        SFMModule
    ]
})

export default class StoreAddModule {
    static routes = routes;
}
