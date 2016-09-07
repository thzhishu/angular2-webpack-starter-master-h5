import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomerDetail } from './detail.component';
import { BusinessTab } from '../../business-tab/business-tab';
import { BTModule } from '../../business-tab/bt.module';


// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: CustomerDetail }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    CustomerDetail,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
    BTModule,
  ]
})
export default class CustomerDetailModule {
  static routes = routes;
}
