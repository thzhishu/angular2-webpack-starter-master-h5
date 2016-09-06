import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StoreFormComponent } from './form.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    StoreFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [StoreFormComponent],
})
export class SFMModule {

}
