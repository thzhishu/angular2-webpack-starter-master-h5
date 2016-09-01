import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomerDetail } from './detail.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: CustomerDetail }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    CustomerDetail
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class CustomerDetailModule {
  static routes = routes;
}
