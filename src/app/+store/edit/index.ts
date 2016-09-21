import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StoreEditComponent } from './edit.component';
import { SFMModule } from '../form/sfm.module';
import { MeResolver, StoreResolver } from '../../app.resolver';

export const routes = [
  {
    path: '', component: StoreEditComponent, pathMatch: 'full',
    resolve: {
      MeData: MeResolver,
      StoreData: StoreResolver,
    },
  }
];

@NgModule({
  declarations: [StoreEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SFMModule
  ]
})

export default class StoreEditModule {
  static routes = routes;
}
