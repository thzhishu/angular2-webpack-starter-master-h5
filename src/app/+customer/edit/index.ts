import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomerEdit } from './edit.component';
import { CFMModule } from '../form/cfm.module';

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
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    CFMModule
  ]
})
export default class CustomerEditModule {
  static routes = routes;
}
