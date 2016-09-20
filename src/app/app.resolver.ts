import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { UserApi,ShopApi } from 'client';

@Injectable()
export class MeResolver implements Resolve<any> {
  constructor(private userApi:UserApi) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //   console.log('MeResolver',route,state);
    return this.userApi.userMeGet();
  }
}

@Injectable()
export class StoreResolver implements Resolve<any> {
  constructor(private shopApi:ShopApi) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //   console.log('StoreResolver',route,state);
    return this.shopApi.shopMyshopGet();
  }
}

// an array of services to resolve routes with data
export const APP_RESOLVER_PROVIDERS = [
  MeResolver,
  StoreResolver
];
