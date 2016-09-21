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
  list: BusinessList = { score: 0, content: [] };
  today: string = moment().format('YYYY-MM-DD');
  date: string = moment().format('YYYY-MM-DD');
  page: any = { current: 1, limit: 20, total: 0 };
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
  isAlert: boolean = false;

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

  //重置列表参数
  initListParams() {
    this.page.current = 1;
    this.end = false;
  }

  /**
   * 选择日期时,更新列表
   * @param  {[DOM]} event [当前input对象]
   * @return {[type]}       [description]
   */
  onPickerChange(event) {
    this.initListParams();
    this.date = event == '' ? this.today : event;
    this.getList();
  }
  /**
   * 上一天
   * @return {[type]} [description]
   */
  onLastDate() {
    this.initListParams();
    this.date = moment(this.date).subtract(1, 'days').format('YYYY-MM-DD');
    this.getList();
  }

  /**
   * 下一天
   * @return {[type]} [description]
   */
  onNextDate() {
    this.initListParams();
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
   * 无限加载 逻辑判断
   * @param  {[type]} scroll [是否滚动加载]
   * @param  {[type]} input  [输入]
   * @param  {[type]} output [输出]
   * @param  {[type]} cur    [当前页]
   * @param  {[type]} limit  [分页大小]
   * @return {[type]}        [description]
   */
  scrollLoading(scroll, input, output, cur, limit) {
    let start = 0, end = 0;

    if (input && input.length > 0) {
      if (input.length < limit) {
        end = limit * (cur - 1);
        this.end = true;
      } else {
        end = limit * (cur - 1);
      }
      if (scroll) {
        _.assign(output, output.slice(start, end).concat(input)); // 替换当前页面记录
      } else {
        _.assign(output, input);
      }
    } else {
      if (scroll) {

      } else {
        _.assign(output, []);
      }
      this.end = true;
    }
  }

  /**
   * 查询今日服务
   * @param  {bealoon} scroll=false [是否滚动加载]
   * @return null
   */
  getList(scroll = false) {
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      // 阻止连续请求
      if (this.loading) {
        return false;
      }
      this.loading = true;
      // 滚条请求 到达底部
      if (scroll && !this.end) {
        this.page.current++; //下一页
      }
      this.bApi.businessListGet(this.moment(this.date), this.page.current).subscribe(res => {
        this.loading = false;
        if (res.meta && res.meta.code === 200 && res.data) { // 成功有数据时
          this.list.score = res.data.score;
          this.page.total = res.meta.total;
          this.scrollLoading(scroll, res.data.content, this.list.content, this.page.current, this.page.limit);
        } else {
          this.list.score = 0;
          this.page.total = 0;
          this.list.content = [];
          if (res.error) {
            alert(res.error.message);
          }
        }
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
    this.tipKey = 'delete';
    this.business = item;
  }
  /**
   * 确定按键
   * @return {[type]} [description]
   */
  onOkey(tipkey) {
    if (tipkey === 'delete') {
      this.delete(this.business);
    }
    if (tipkey === 'alert') {
      this.showTipWin = false;
    }
  }
  /**
   * 取消按键
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
    if (item.customerStatus!==1) {
      this.router.navigate(['/dashboard/customer/detail/' + item.customerId]); // 跳转 顾客单人页
    } else {
      this.isAlert = true;
      this.tipMsg = '顾客已删除,无法查看';
      this.showTipWin = !0;
      this.tipKey = 'alert';
    }
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
  onSwipeLeft(index, items) {
    _.forEach(items, (val, i) => {
      val.swipeleft = 0;
    });
    items[index].swipeleft = 1;

  }
  onSwipeRight(index, items) {
    items[index].swipeleft = 0;
  }
}
