import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BusinessTab } from './business-tab';
import { ScrollableDirective } from '../directives/scrollable';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    BusinessTab,
    ScrollableDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [BusinessTab,ScrollableDirective],
})
export class BTModule {

}
