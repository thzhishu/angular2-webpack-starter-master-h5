import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SubAccountForm } from './form.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    SubAccountForm,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [SubAccountForm],
})
export class AFMModule {
  
}
