import { Injectable }             from '@angular/core';
import { CanActivate, Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }    from '@angular/router';
import { Cookie } from 'services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!Cookie.load('token')) {
      this.router.navigate(['/login']);
      return false;
    }
    if (!Cookie.load('shopId')) {
      this.router.navigate(['/init']);
      return false;
    }
    return true;
  }
}
