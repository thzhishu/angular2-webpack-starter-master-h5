import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ReportWeek } from './week.component';
import { BTModule } from '../../business-tab/bt.module';

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
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    BTModule,
  ]
})
export default class ReportWeekModule {
  static routes = routes;
}
