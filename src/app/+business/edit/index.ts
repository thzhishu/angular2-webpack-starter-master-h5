import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BusinessEditComponent } from './edit.component';
import { MeResolver, StoreResolver } from '../../app.resolver';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  {
    path: '', component: BusinessEditComponent,
    resolve: {
      MeData: MeResolver,
    },
  }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    BusinessEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class BusinessEditModule {
  static routes = routes;
}
