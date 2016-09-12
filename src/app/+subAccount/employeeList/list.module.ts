import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AccountEmployeeList } from './list.component';
import { AccountEmployeeAddModule } from '../employeeAdd/add.module';


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    AccountEmployeeList
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AccountEmployeeAddModule
  ],
  exports: [AccountEmployeeList],
})
export class AccountEmployeeListModule {
}

