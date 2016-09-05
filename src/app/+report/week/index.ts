import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ReportWeek } from './week.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: ReportWeek, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    ReportWeek
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class ReportWeekModule {
  static routes = routes;
}
