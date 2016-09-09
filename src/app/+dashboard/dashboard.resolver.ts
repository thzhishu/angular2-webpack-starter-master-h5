import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { UserApi, ShopApi, Shop, MyAcountResponse } from 'client';

@Injectable()
export class RolesResolver implements Resolve<any> {
  constructor(private uApi: UserApi) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.uApi.userMeGet();
  }
  // getMe() {
  //   this.uApi.userMeGet().subscribe((data: MyAcountResponse) => {
  //     this.shopId = data.data.user.lastShopId;
  //     this.getList();
  //   })
  // }

  // getList() {
  //   this.sApi.shopMyshopGet().subscribe((data) => {
  //     this.list = data.data;
  //     _.forEach(this.list, (val, i) => {
  //       if (this.shopId === val.id) {
  //         this.storeName = val.name;
  //       }
  //     })
  //   })
  // }
}

// an array of services to resolve routes with data
export const ROLES_RESOLVER_PROVIDERS = [
  RolesResolver
];
