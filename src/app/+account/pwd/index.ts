import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AccountPwd } from './pwd.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: AccountPwd }
];
@NgModule ({
    declarations: [
        AccountPwd
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(routes),
    ]
})
export default class AccountPwdModule {
  static routes = routes;
}
