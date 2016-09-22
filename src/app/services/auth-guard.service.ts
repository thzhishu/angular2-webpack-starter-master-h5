import { Injectable }             from '@angular/core';
import { CanActivate, Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }    from '@angular/router';
import { Cookie } from 'services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return false;
    }
    if (!localStorage.getItem('shopId')) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
