import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BusinessListComponent } from './list.component';
import { BusinessTab } from '../../business-tab';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: BusinessListComponent }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    BusinessTab,
    BusinessListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class BusinessListModule {
  static routes = routes;
}
