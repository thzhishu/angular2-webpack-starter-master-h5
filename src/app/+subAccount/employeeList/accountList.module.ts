import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AccountEmployeeList } from './list.component';


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    AccountEmployeeList
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [AccountEmployeeList],
})
export class AccountEmployeeListModule {
}

