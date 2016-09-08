import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SearchPage } from './search.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: SearchPage, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    SearchPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class SearchPageModule {
  static routes = routes;
}
