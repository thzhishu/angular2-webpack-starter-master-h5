import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ForgetPwd } from './forget-pwd.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: ForgetPwd, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    ForgetPwd
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class ForgetPwdModule {
  static routes = routes;
}
