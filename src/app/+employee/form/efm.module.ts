import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EmployeeForm } from './form.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    EmployeeForm,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [EmployeeForm],
})
export class EFMModule {
  
}
