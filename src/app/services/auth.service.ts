import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { Cookie } from 'services';
import { UserApi } from 'client';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {


  isLoggedIn: boolean = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string = 'login';

  login() {

  }

  logout() {
    this.isLoggedIn = false;
  }
}
