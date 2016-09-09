import { Component, Input, Output, NgZone, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';

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
  ngOnDestroy() {

  }




  onToggleDate(event) {
    event.stopPropagation();
    this.dateShow = !this.dateShow;
  }

  public closeDatePicker(event) {
    event.stopPropagation();
    this.dateShow = false;
  }

  moment(date, format = '') {
    return moment(date).format(format || 'YYYY-MM-DD');
  }


  onPickerChange(event) {
    this.page.current = 1;
    this.date = event == '' ? this.today : event;
    this.getList();
  }

  onLastDate() {
    this.page.current = 1;
    this.date = moment(this.date).subtract(1, 'days').format('YYYY-MM-DD');
    this.getList();
  }

  onNextDate() {
    this.page.current = 1;
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.getList();
  }

  isToday() {
    return moment(this.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD');
  }

  onOpen() {

  }

  onClose() {
    this.getList();
  }

  changePage(event) {
    this.page.current = event.page;
    this.getList();
  }

  getList(scroll = false) {
    this.loading = true;

    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (scroll && !this.end) {
        this.page.current++;
      }
      this.bApi.businessListGet(this.moment(this.date), this.page.current).subscribe(res => {
        if (res.meta && res.meta.code === 200 && res.data) {
          if (scroll) {
            this.list.content = this.list.content.concat(res.data.content);
          } else {
            this.list = res.data;
          }
          this.page.current = res.meta.current;
        } else {
          if (scroll) {

          } else {
            this.list = {};
          }
          this.end = true;
        }
        this.page.limit = res.meta.limit;
        this.page.total = res.meta.total;
        this.loading = false;
      })
    }, 500);
  }

  delete(data) {
    this.loading = true;
    //payload: models.BusinessDetail
    this.bApi.businessDeleteDelete(data.id).subscribe(res => {
      this.loading = false;
      if (res.meta.code === 200) {
        this.router.navigate(['/dashboard/business/list']);
        this.onCancel();
      } else {
        alert(res.error.message);
      }
    }, err => {
      this.loading = false;
      console.error(err);
    });
  }
  onDelRecord(item, e) {
    e.stopPropagation();
    this.showTipWin = true;
    this.tipMsg = '是否删除该服务记录?';
    this.business = item;
  }
  onOkey() {
    this.delete(this.business);
  }
  onCancel() {
    this.showTipWin = false;
    this.getList();
  }
  onGoto(item) {
    this.router.navigate(['/dashboard/customer/detail/' + item.customerId]);
  }

  //无限滚动
  onScrollEnd(next) {
    this.next = next;
    if (next && !this.loading) {
      this.getList(true);
    }
  }
  onScrollTop(returnTop) {
    this.isReturnTop = !returnTop;
    this.returnTop = !!returnTop;
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
