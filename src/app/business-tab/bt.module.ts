import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BusinessTab } from './business-tab';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    BusinessTab,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [BusinessTab],
})
export class BTModule {

}
