import { Component, Input, Output, NgZone, OnDestroy } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

import { BusinessApi, BusinessList, BusinessListResponse } from 'client';

@Component({
  selector: 'business-list',
  template: require('./list.html'),
  styles: [require('./list.scss')],
})

export class BusinessListComponent {
  list: BusinessList;
  today: string = moment().format('YYYY-MM-DD');
  date: string = moment().format('YYYY-MM-DD');
  page: any = { current: 1 };
  dateShow: boolean = false;
  timeout: any;
  shopChangeSub: Subscription;
  next: boolean = false;
  loading: boolean = false;
  end: boolean = false;
  isReturnTop: boolean = false;
  returnTop: boolean = false;
  showTipWin: boolean = false;
  tipMsg: string = '';
  tipKey: string = 'back';
  tipOkeyBtnTxt: string = '确定';
  oldFeildString: string = '';
  business: string = '';
  zone: any;

  constructor(private router: Router, private route: ActivatedRoute, private bApi: BusinessApi) {
    this.zone = new NgZone({ enableLongStackTrace: false }); //事务控制器
  }

  // 初始化
  ngOnInit() {
    this.getList();
  }

  // 销毁
  ngOnDestroy() {

  }

  /**
   * 时间格式化
   * @param  {[date]} date      [时间]
   * @param  {[type]} format='' [格式]
   * @return {[type]}           [需要的格式]
   */
  moment(date, format = '') {
    return moment(date).format(format || 'YYYY-MM-DD');
  }

  /**
   * 选择日期时,更新列表
   * @param  {[DOM]} event [当前input对象]
   * @return {[type]}       [description]
   */
  onPickerChange(event) {
    this.page.current = 1;
    this.date = event == '' ? this.today : event;
    this.getList();
  }
  /**
   * 上一天
   * @return {[type]} [description]
   */
  onLastDate() {
    this.page.current = 1;
    this.date = moment(this.date).subtract(1, 'days').format('YYYY-MM-DD');
    this.getList();
  }

  /**
   * 下一天
   * @return {[type]} [description]
   */
  onNextDate() {
    this.page.current = 1;
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.getList();
  }
  /**
   * 小于今天
   * @return {[type]} [description]
   */
  isToday() {
    return moment(this.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD');
  }

  /**
   * 查询今日服务
   * @param  {bealoon} scroll=false [是否滚动加载]
   * @return null
   */
  getList(scroll = false) {
     //阻止连续请求
    if (this.loading) {
      return false;
    }
    this.loading = true;
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
        // 滚条请求 未到达底部
      if (scroll && !this.end) {
        this.page.current++; //下一页
      }
      this.end = false;
      this.bApi.businessListGet(this.moment(this.date), this.page.current).subscribe(res => {
        if (res.meta && res.meta.code === 200 && res.data) { // 成功有数据时
          if (scroll) {
            this.list.content = this.list.content.concat(res.data.content); //追加记录
          } else {
            this.list = res.data;
          }
          this.page.current = res.meta.parameters.pageNumber;
        } else {
          if (scroll) {

          } else {
            this.list = {};
          }
          this.end = true;
        }
        this.loading = false;
      });
    }, 500);
  }

  /**
   * 删除服务
   * @param  {[object]} data [服务对象]
   * @return {[type]}      [description]
   */
  delete(data) {
    this.loading = true;
    //payload: models.BusinessDetail
    this.bApi.businessDeleteDelete(data.id).subscribe(res => {
      this.loading = false;
      if (res.meta.code === 200) {
        this.router.navigate(['/dashboard/business/list']); // 跳转 今日服务
        this.onCancel();
      } else {
        alert(res.error.message);
      }
    }, err => {
      this.loading = false;
      console.error(err);
    });
  }

  /**
   * 删除服务 提示窗口
   * @param  {[object]} item [删除的服务对象]
   * @param  {[object]} e    [DOM对象]
   * @return {[type]}      [description]
   */
  onDelRecord(item, e) {
    e.stopPropagation();
    this.showTipWin = true;
    this.tipMsg = '是否删除该服务记录?';
    this.business = item;
  }
  /**
   * 确定删除
   * @return {[type]} [description]
   */
  onOkey() {
    this.delete(this.business);
  }
  /**
   * 取消删除
   * @return {[type]} [description]
   */
  onCancel() {
    this.showTipWin = false;
    this.getList();
  }

  /**
   * 跳转到选择服务的顾客单人页
   * @param  {[object]} item [服务对象]
   * @return {[type]}      [description]
   */
  onGoto(item) {
    this.router.navigate(['/dashboard/customer/detail/' + item.customerId]); // 跳转 顾客单人页
  }

  //无限滚动
  onScrollEnd(next) {
    this.next = next;
    if (next && !this.loading) {
      this.getList(true);
    }
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

  //滑动按钮
  onSwipeLeft(event, listTbody) {
    event.preventDefault();
    _.forEach(listTbody.children, (val, i) => {
      val.classList.remove('swipeleft');
    })
    event.target.parentNode.classList.add('swipeleft');
  }
  onSwipeRight(event, listTbody) {
    event.preventDefault();
    event.target.parentNode.classList.remove('swipeleft');
  }
  // onPanUp(event, listTbody) {
  //   event.preventDefault();
  //   if (listTbody.scrollHeight == listTbody.scrollTop + listTbody.clientHeight) {
  //
  //     event.target.parentNode.parentNode.classList.add('panup');
  //     window.setTimeout(() => {
  //       event.target.parentNode.parentNode.classList.remove('panup');
  //     }, 1800);
  //   } else {
  //     event.target.parentNode.parentNode.classList.remove('panup');
  //   }
  // }
}
