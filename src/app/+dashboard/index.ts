import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Dashboard } from './dashboard.component';
// import { BusinessTab } from '../business-tab';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  {
    path: '', component: Dashboard,
    children: [
      { path: '', redirectTo: 'customer/list', pathMatch: 'full' },
      {
        path: 'customer',
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', loadChildren: () => System.import('../+customer/list') },
          { path: 'add', loadChildren: () => System.import('../+customer/add') },
          { path: 'edit/:id', loadChildren: () => System.import('../+customer/edit') },
          { path: 'detail/:id', loadChildren: () => System.import('../+customer/detail') },
        ]
      },
      {
        path: 'employee',
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', loadChildren: () => System.import('../+employee/list') },
          { path: 'add', loadChildren: () => System.import('../+employee/add') },
          { path: 'edit/:id', loadChildren: () => System.import('../+employee/edit') },
        ]
      },
      {
        path: 'search',
        children: [
          { path: 'page', loadChildren: () => System.import('../+search/search') },
          { path: 'result/:skey', loadChildren: () => System.import('../+search/result') },
        ]
      },
      {
        path: 'business',
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', loadChildren: () => System.import('../+business/list') },
          { path: 'add', loadChildren: () => System.import('../+business/add') },
          { path: 'edit/:id', loadChildren: () => System.import('../+business/edit') },
        ]
      },
      {
        path: 'report',
        children: [
          { path: 'week', loadChildren: () => System.import('../+report/week') },
        ]
      },
      {
        path: 'account',
        children: [
          { path: 'info', loadChildren: () => System.import('../+account/info') },
          { path: 'pwd', loadChildren: () => System.import('../+account/pwd') },
        ]
      },
    ]
  }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    Dashboard,
    // BusinessTab
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class DashboardModule {
  static routes = routes;
}
