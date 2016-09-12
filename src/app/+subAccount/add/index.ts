import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SubAccountAdd } from './add.component';
import { AFMModule } from '../form/afm.module';
import { AccountEmployeeListModule } from '../employeeList/list.module';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: SubAccountAdd, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    SubAccountAdd
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AFMModule,
    AccountEmployeeListModule
  ]
})
export default class SubAccountAddModule {
  static routes = routes;
}
