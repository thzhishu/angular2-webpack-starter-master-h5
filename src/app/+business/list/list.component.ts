import { Component, Input, Output, NgZone, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

import { BusinessApi,BusinessList, BusinessListResponse } from 'client';



@Component({
  selector: 'business-list',
  template: require('./list.html'),
  styles: [require('./list.scss')],
})


export class BusinessListComponent {
  list: BusinessList;
  today: string = moment().format('YYYY-MM-DD');
  date: string =  moment().format('YYYY-MM-DD');
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

  constructor(private router: Router, private route: ActivatedRoute, private bApi: BusinessApi) {

  }

  // 初始化
  ngOnInit() {
    this.getList();
  }
  ngOnDestroy() {

  }

  onSwipeLeft(event) {
    event.preventDefault();
    event.target.parentNode.classList.add('swipeleft');
  }
  onSwipeRight(event) {
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
  onScrollEnd(next) {
    this.next = next;
    if (next&&!this.loading) {
      this.getList(true);
    }
  }
  onScrollTop(returnTop) {
    this.isReturnTop = !returnTop;
    this.returnTop = !!returnTop;
  }

  onReturnTop(){
    this.returnTop = true;
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
    this.date = event;
    this.getList();
  }

  onLastDate() {
    this.date = moment(this.date).subtract(1, 'days').format('YYYY-MM-DD');
    this.getList();
  }

  onNextDate() {
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.getList();
  }

  isToday() {
    return moment(this.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD');
  }

  onOpen() {
    console.log('onOpen');
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
        if (scroll&&!this.end) {
          this.page.current += 1;
        }
      this.bApi.businessListGet(this.moment(this.date), this.page.current).subscribe(data => {
        if (data.meta&&data.meta.code === 200 && data.data) {
          if (scroll) {
            this.list.content = this.list.content.concat(data.data.content);
          } else {
            this.list = data.data;
          }
        } else {
          this.end = true;
        }
        this.loading = false;
      })
    }, 500)
  }

  onOpenBusinessAdd() {
    // this.missionService.confirmBusinessAdd({ selector: 'business-list' });
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
  onDelRecord(item){
      this.showTipWin = true;
      this.tipMsg = '是否删除该服务记录?';
      this.business = item;
  }
  onOkey(){
    this.delete(this.business);
  }
  onCancel(){
      this.showTipWin = false;
      this.getList();
  }
  onGoto(item){
      this.router.navigate(['/dashboard/customer/detail/'+item.customerId]);
  }
}
