import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EmployeeEdit } from './edit.component';
import { EFMModule } from '../form/efm.module';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: EmployeeEdit, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    EmployeeEdit
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
    EFMModule
  ]
})
export default class EmployeeEditModule {
  static routes = routes;
}
