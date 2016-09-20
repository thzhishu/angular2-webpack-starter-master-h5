import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EmployeeList } from './list.component';
import { BTModule } from '../../business-tab/bt.module';
import { MeResolver, StoreResolver } from '../../app.resolver';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  {
    path: '', component: EmployeeList, pathMatch: 'full',
    resolve: {
      MeData: MeResolver,
      StoreData: StoreResolver,
    },
  }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    EmployeeList
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    BTModule,
  ]
})
export default class EmployeeListModule {
  static routes = routes;
}
