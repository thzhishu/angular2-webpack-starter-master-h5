import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SubAccountEdit } from './edit.component';
import { AFMModule } from '../form/afm.module';
import { AccountEmployeeListModule } from '../employeeList/list.module';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: SubAccountEdit, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    SubAccountEdit
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AFMModule,
    AccountEmployeeListModule
  ]
})
export default class SubAccountEditModule {
  static routes = routes;
}
