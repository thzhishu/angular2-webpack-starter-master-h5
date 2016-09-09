import { Injectable } from '@angular/core';
import { Router }    from '@angular/router';
import { UserApi } from 'client';


@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;
  errorMsg: string = '';

  // store the URL so we can redirect after logging in
  redirectUrl: string;


  constructor(private uApi: UserApi, private router: Router) {

  }

  login(phone, pwd, rnd, uuid) {
    this.uApi.defaultHeaders.set('uuid', uuid);
    return this.uApi.userLoginPost(phone, pwd, rnd)
      .subscribe((data) => {
        if (data.meta && data.meta.code === 200) {
          this.isLoggedIn = true;
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('shopId', String(data.data.lastShopId));
          localStorage.setItem('clientType', 'h5');
          this.router.navigate(['/dashboard/business/list']);
        } else {
          this.errorMsg = data.error.message;
          this.isLoggedIn = false;
        }
      });
  }

  logout() {
    this.isLoggedIn = false;
  }
}
