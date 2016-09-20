import { Injectable }      from '@angular/core';
import { CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot }    from '@angular/router';
import { AuthService }     from './auth.service';
import { Cookie } from 'services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log('canActivate', route, state);
    return !!Cookie.load('token');
    // let me = route.data['MeData'];
    // if (!!me && me.meta && me.meta.code == 200) {
    //   return true;
    // } else {
    //   if (!!me && me.meta) {
    //     alert(me.meta.message);
    //   }
    //   this.router.navigate(['/login']);
    //   return false;
    // }

    // if (this.authService.isLoggedIn) {
    //     return true;
    // }
    //
    // // Store the attempted URL for redirecting
    // this.authService.redirectUrl = state.url;
    //
    // // Navigate to the login page
    // this.router.navigate(['/login']);
    // return false;
  }
}
