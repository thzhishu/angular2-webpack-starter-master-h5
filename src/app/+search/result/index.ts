import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SearchResult } from './result.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: SearchResult, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    SearchResult
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class SearchResultModule {
  static routes = routes;
}
