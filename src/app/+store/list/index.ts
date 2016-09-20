import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StoreListComponent } from './list.component';
import { BTModule } from '../../business-tab/bt.module';
import { MeResolver, StoreResolver } from '../../app.resolver';
export const routes = [
  {
    path: '', component: StoreListComponent, pathMatch: 'full',
    resolve: {
      MeData: MeResolver,
      StoreData: StoreResolver,
    },
  }
];

@NgModule({
  declarations: [StoreListComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    BTModule,
  ]
})

export default class StoreListModule {
  static routes = routes;
}
