import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomerAdd } from './add.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: CustomerAdd }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    CustomerAdd
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class CustomerAddModule {
  static routes = routes;
}
