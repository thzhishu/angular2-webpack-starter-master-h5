import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EmployeeList } from './list.component';
import { BTModule } from '../../business-tab/bt.module';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: EmployeeList, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    EmployeeList
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
    BTModule,
  ]
})
export default class EmployeeListModule {
  static routes = routes;
}
