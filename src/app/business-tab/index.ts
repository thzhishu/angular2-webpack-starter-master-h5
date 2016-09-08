import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BusinessTab } from './business-tab';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: BusinessTab }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    BusinessTab,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class BusinessTabModule {
  static routes = routes;
}
