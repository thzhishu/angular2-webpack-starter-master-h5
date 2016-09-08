import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomerList } from './list.component';
import { BTModule } from '../../business-tab/bt.module';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: CustomerList }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    CustomerList
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
    BTModule,
  ]
})
export default class CustomerListModule {
  static routes = routes;
}
