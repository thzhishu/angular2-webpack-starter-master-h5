import { Component } from '@angular/core';
import {  Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserApi, ShopApi, Shop, MyAcountResponse } from 'client';
import { Cookie, ThzsUtil } from '../services';

import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

// import { BusinessTab } from '../business-tab';

const NO_MENU_URLS = [
    '/dashboard/customer/add',
    '/dashboard/customer/edit',
    '/dashboard/employee/add',
    '/dashboard/employee/edit',
    '/dashboard/business/add',
    '/dashboard/business/edit',
    '/dashboard/account/pwd',
    '/dashboard/store/list',
    '/dashboard/store/add',
    '/dashboard/store/edit',
    '/dashboard/account/subAccount/add',
    '/dashboard/account/subAccount/edit',
    '/dashboard/account/subAccount/list',
];
const NO_TOPBAR_URLS = [
    '/dashboard/search/page'
];

@Component({
    selector: 'dashboard',
    template: require('./dashboard.template.html'),
    styles: [require('./dashboard.style.scss')],
})
export class Dashboard {
    showMenu: boolean = false;
    showStoreLayer: boolean = false;
    title: string;
    storeName: string;
    shopId: number;
    list: Array<Shop>;
    routeSub: any;
    noMenu: boolean = false;
    noTopbar: boolean = false;
    shopCount: number = 0;


    constructor(private router: Router,private route: ActivatedRoute, private uApi: UserApi, private sApi: ShopApi, private thzsUtil: ThzsUtil) {
        console.log('dashboard constructor...');
        this.routeSub = this.router.events.filter( event => event instanceof NavigationEnd)
                                          .map(event => event.url)
                                          .subscribe( data => {

                                              console.log('NavigationEnd URL: ', data);
                                              if (_.includes(data,'/edit/')) {
                                                data = data.slice(0, data.indexOf('/edit/') + 5);
                                              }
                                              this.noMenu = _.includes(NO_MENU_URLS,data) ? true : false;
                                              this.noTopbar = _.includes(NO_TOPBAR_URLS,data) ? true : false;
                                          });

        this.thzsUtil.refreshShopList$.subscribe(data => {
          console.log('fresh...');
          if (data) {
            this.getList();
          }
        });


    }

    ngOnInit() {
     this.shopId = this.route.snapshot.data['MeData'].data.user.lastShopId;
     this.list = this.route.snapshot.data['StoreData'].data;
     _.forEach(this.list, (val, i) => {
       if (this.shopId === val.id) {
         this.storeName = val.name;
       }
     })
    }
    ngOnDestroy() {
      this.routeSub.unsubscribe();
    }

    onToggleMenu() {
        this.showMenu = !this.showMenu;
    }
    onShowStoreLayer() {
        this.showStoreLayer = true;
    }
    onCloseStoreLayer() {
        this.showStoreLayer = false;
    }
    onToggleStoreLayer(e) {
        e.stopPropagation();
        if (this.shopCount <= 1) return;
        this.showStoreLayer = !this.showStoreLayer;
    }

    getMe() {
      this.uApi.userMeGet().subscribe((data: MyAcountResponse) => {
        this.shopId = data.data.user.lastShopId;
        this.getList();
      })
    }

    getList() {
      this.sApi.shopMyshopGet().subscribe((data) => {
        this.list = data.data;
        this.shopCount = this.list.length;
        _.forEach(this.list, (val, i) => {
          if (this.shopId === val.id) {
            this.storeName = val.name;
          }
        })
      })
    }

    changeCurrentStore(item) {
      this.uApi.userShopCurrentPost(item.id).subscribe((data) => {
        this.storeName = item.name;
        Cookie.save('shopId', item.id);
        if (this.router.url === '/dashboard/business/list') {
            window.location.reload();
        } else {
          this.router.navigate(['/dashboard/business/list']);
        }

      });
    }

    gotoSearchPage() {
        this.router.navigate(['/dashboard/search/page']);
    }

    /**
     * 退出系统并返回登录
     */
    onExit() {
      Cookie.remove('token');
      this.router.navigate(['/login']);
    }

}
