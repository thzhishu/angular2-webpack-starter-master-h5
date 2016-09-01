import { Component, Input, Output, NgZone, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

import { BusinessApi,BusinessDetail,EmployeeListItem,EmployeeApi } from 'client';
import { Cookie } from 'services';



@Component({
  selector: 'business-edit',
  directives: [
    ...ROUTER_DIRECTIVES
  ],
  template: require('./edit.html'),
  styles: [require('./edit.scss')],
  providers: [HTTP_PROVIDERS, BusinessApi,EmployeeApi]
})


export class BusinessEditComponent {
  oldFeildString:string;
  showTipWin:boolean;
  tipMsg:string;
  tipKey:string;
  bs:BusinessDetail = {employeeId:null};
  employeeList: Array<EmployeeListItem>;

  constructor(private router: Router, private route: ActivatedRoute, private bApi: BusinessApi,private eApi: EmployeeApi) {
  }
  ngOnInit() {
    this.oldFeildString = Md5.hashStr(JSON.stringify(this.bs), false).toString();
    this.getEmployeeList();
  }

  getEmployeeList() {
    this.eApi.employeeListGet(String(1), String(10000)).subscribe(data => {
      if (data.meta.code === 200) {
        this.employeeList = data.data;
      }
    });
  }

  checkFormChange() {
      const current = Md5.hashStr(JSON.stringify(this.bs), false).toString();
      return this.oldFeildString === current ? true : false;
  }

  back(){
      if (this.checkFormChange()) {
          window.history.back();
      } else {
          this.showTipWin = true;
          this.tipMsg = '当前页面尚有信息未保存，是否离开？';
          this.tipKey = 'back';
      }
  }
  onOkey(key) {
      if (key === 'back') {
          window.history.back();
          return;
      }
  }
  onCancel(key) {
      this.showTipWin = false;
      this.tipMsg = '';
      this.tipKey = '';
  }
  onSave(){

  }
}
