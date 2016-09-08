import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AccountInfo } from './info.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: AccountInfo }
];
@NgModule ({
    declarations: [
        AccountInfo
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(routes),
    ]
})
export default class AccountInfoModule {
  static routes = routes;
}
