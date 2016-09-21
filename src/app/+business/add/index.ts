import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BusinessAddComponent } from './add.component';
import { MeResolver, StoreResolver } from '../../app.resolver';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  {
    path: '', component: BusinessAddComponent,
    resolve: {
      MeData: MeResolver,
    },
  }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    BusinessAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class BusinessAddModule {
  static routes = routes;
}
