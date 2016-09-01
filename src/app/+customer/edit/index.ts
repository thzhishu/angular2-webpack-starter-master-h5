import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomerEdit } from './edit.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: CustomerEdit }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    CustomerEdit
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class CustomerEditModule {
  static routes = routes;
}
