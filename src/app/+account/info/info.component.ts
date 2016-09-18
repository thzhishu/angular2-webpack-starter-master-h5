import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserApi, ShopApi, Shop, MyAcountResponse, AcountInfo } from 'client';

@Component({
    selector: 'account-info',
    styles: [require('./info.style.scss')],
    template: require('./info.template.html'),
    providers: [UserApi, ShopApi]
})

export class AccountInfo implements OnInit {

    account: AcountInfo;
    constructor(private router: Router, private uApi: UserApi, private sApi: ShopApi) {}

    ngOnInit() {
      this.getMe();
    }

    /**
     * 获取账号信息
     */
    getMe() {
      this.uApi.userMeGet().subscribe((data: MyAcountResponse) => {
        if (data.meta.code === 200 && data.data) {
            this.account = data.data;
        } else {
            if (data.error && data.error.message) {
                console.log(data.error.message);
            }
        }
      }, err => console.error(err));
    }
}
