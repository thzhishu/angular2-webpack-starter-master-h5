import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AccountEmployeeAdd } from './add.component';


@NgModule({
  declarations: [
    AccountEmployeeAdd
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [AccountEmployeeAdd],
})
export class AccountEmployeeAddModule {
}
