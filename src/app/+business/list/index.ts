import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { BTModule } from '../../business-tab/bt.module';
import { BusinessTab } from '../../business-tab/business-tab';
import { ScrollableDirective } from '../../directives/scrollable';
import { BusinessListComponent } from './list.component';
import { BusinessApi } from 'client';
// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: BusinessListComponent }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    BusinessListComponent,
    ScrollableDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
    BTModule,
  ],
  providers: [
    BusinessApi
  ]
})
export default class BusinessListModule {
  static routes = routes;
}
