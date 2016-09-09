import { Routes, RouterModule } from '@angular/router';
import { Home } from './home';
import { NoContent } from './no-content';

import { DataResolver } from './app.resolver';
// import { AuthGuard } from './auth.guard';


export const ROUTES: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  {
    path: 'login', loadChildren: () => System.import('./+login')
  },
  {
    path: 'register', loadChildren: () => System.import('./+register')
  },
  {
    path: 'forget-pwd', loadChildren: () => System.import('./+forget-pwd')
  },
  {
    path: 'dashboard',
    loadChildren: () => System.import('./+dashboard'),
    // canActivate: [AuthGuard]
  },
  {
    path: 'init', loadChildren: () => System.import('./+store/init')
  },
  { path: '**',    component: NoContent },
];
