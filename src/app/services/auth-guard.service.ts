import { Injectable }             from '@angular/core';
import { CanActivate, Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }    from '@angular/router';
import { Cookie } from 'services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!!Cookie.load('token')) { return true; }
    window.location.href = '/#/login';

    // Navigate to the login page with extras
    // this.router.navigate(['/login']);
    return false;
  }
}
