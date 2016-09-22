import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { UserApi, ShopApi, Shop, MyAcountResponse } from 'client';
import * as _ from 'lodash';

@Component({
  selector: 'store-list',
  styles: [require('./list.style.scss')],
  template: require('./list.template.html'),
  //directives: [ROUTER_DIRECTIVES],
  providers: [ShopApi]
})

export class StoreListComponent implements OnInit {

  stores = [];
  isReturnTop: boolean = false;
  returnTop: boolean = false;
  code: any;

  constructor(private router: Router, private sApi: ShopApi, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getStores();
    if (this.route.snapshot.data['MeData']) {
      if (!this.route.snapshot.data['MeData'].meta) {
        this.code = this.route.snapshot.data['MeData'].data.roles[0].code;
      } else if (this.route.snapshot.data['MeData'].meta.code === 401) {
        
        this.router.navigate(['/login']);
        return false;
      }
    }
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
  onSwipeLeft(index, items) {
    _.forEach(items, (val, i) => {
      val.swipeleft = 0;
    });
    items[index].swipeleft = 1;

  }
  onSwipeRight(index, items) {
    items[index].swipeleft = 0;
  }

  //滚动判断
  onScrollTop(returnTop) {
    this.isReturnTop = !returnTop; //返回头部是否显示
    this.returnTop = !!returnTop; //是否返回头部
  }
  //返回头部
  onReturnTop() {
    this.returnTop = true;
  }

  /**
   * 返回上一页
   */
  back() {
    // window.history.back();
    this.router.navigate(['/dashboard/account/info']);
  }
}
