import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EmployeeEdit } from './edit.component';
import { EFMModule } from '../form/efm.module';
import { MeResolver, StoreResolver } from '../../app.resolver';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  {
    path: '', component: EmployeeEdit, pathMatch: 'full',
    resolve: {
      MeData: MeResolver,
      StoreData: StoreResolver,
    },
  }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    EmployeeEdit
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    EFMModule
  ]
})
export default class EmployeeEditModule {
  static routes = routes;
}
