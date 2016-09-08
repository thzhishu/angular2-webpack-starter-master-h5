import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CustomerForm } from './form.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    CustomerForm,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [CustomerForm],
})
export class CFMModule {

}
