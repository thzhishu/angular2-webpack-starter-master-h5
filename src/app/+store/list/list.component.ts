import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { UserApi, ShopApi, Shop, MyAcountResponse } from 'client';
import * as _ from 'lodash';

@Component({
    selector: 'store-list',
    styles: [ require('./list.style.scss') ],
    template: require('./list.template.html'),
    //directives: [ROUTER_DIRECTIVES],
    providers: [ShopApi]
})

export class StoreListComponent implements OnInit {

    stores = [];

    constructor(private router: Router, private sApi: ShopApi) {}

    ngOnInit() {
        this.getStores();
    }

    /**
     * 去添加门店页面
     */
    onAddStore() {
        this.router.navigate(['/dashboard/store/add']);
    }

    /**
     * 获取门店
     */
    getStores() {
        this.sApi.shopMyshopGet().subscribe((data) => {
            if (data.meta.code === 200 && data.data) {
                this.stores = data.data;
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => console.error(err));
    }

    /**
     * 编辑门店
     */
    onEditStore(id) {
        this.router.navigate(['/dashboard/store/edit', id]);
    }

    //滑动按钮
    onSwipeLeft(event,listTbody) {
      event.preventDefault();
      console.dir(listTbody.children);
      _.forEach(listTbody.children,(val,i)=>{
          val.children[1].classList.remove('swipeleft');
      })
      event.target.classList.add('swipeleft');
    }
    onSwipeRight(event,listTbody) {
      event.preventDefault();
      event.target.classList.remove('swipeleft');
    /**
     * 返回上一页
     */
    back() {
        window.history.back();
    }
}
