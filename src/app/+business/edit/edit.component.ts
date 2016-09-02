import { Component, OnInit, Input, Output, EventEmitter,NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import {  ControlGroup, FormBuilder, Control, NgControlGroup } from '@angular/common';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { Cookie } from 'services';

import { BusinessApi, EmployeeApi, CustomerApi, Customer, EmployeeListItem, CustomerSearchResponse, BusinessDetail } from 'client';

@Component({
  selector: 'business-edit',
  template: require('./edit.html'),
  styles: [require('./edit.scss')],
  directives: [ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, BusinessApi, EmployeeApi, CustomerApi, Md5]
})

export class BusinessEditComponent implements OnInit {
  businessShow: boolean = false;
  loading: number = 0;
  employeeList: Array<EmployeeListItem>;
  customer: any = {id:null};
  employeeChecked: boolean = true;
  business: BusinessDetail = {employeeId:null};
  subscription: Subscription;
  anchor:string;
  zone: any;
  showPlateImg: boolean = false;
  isNewPlate: boolean = false;
  plateErr = {
    empty: false,
    len: false
  };
  businessItemErr: boolean = false;
  businessEmployeeErr: boolean = false;
  addEmployeeErr: boolean = false;
  addEmployeeCodeErr: boolean = false;
  showLoading: boolean = false;
  oldPlate: string = '';
  hadPlate: boolean = false;
  confirmWinShow: boolean = false;
  businessStr: string = '';

  private searchVehicleCode = new Subject<CustomerSearchResponse>();

  private VehicleCode: Observable<CustomerSearchResponse> = this.searchVehicleCode
    .debounceTime(300)
    .distinctUntilChanged()
    .switchMap((term: string) => term.length > 0
               ? this.cApi.customerVehicleVehicleLicenceGet(term)
               : Observable.of({}));


  constructor(private router: Router, private route: ActivatedRoute, private bApi: BusinessApi, private eApi: EmployeeApi, private cApi: CustomerApi) {
    this.zone = new NgZone({ enableLongStackTrace: false }); // 事务控制器
  }

  // 初始化
  ngOnInit() {
    this.getEmployeeList();
    this.VehicleCode.subscribe(data => {
      if (data.meta.code === 200) {
        this.customer = data.data;
        this.showPlateImg = true;
        this.isNewPlate = data.data === null ? true : false;
      } else {
        alert(data.error.message);
      }
      this.showLoading = false;
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  getEmployeeList() {
    this.eApi.employeeListGet(String(1), String(10000)).subscribe(data => {
      if (data.meta.code === 200) {
        this.employeeList = data.data;
      }
    });
  }

  isVehicleLength(f) {
    if (!f.value.vehicleLicence || f.value.vehicleLicence.length < 6) {
      return false;
    }
    return true;
  }

  onChangeVL(val) {
    if ( this.oldPlate === val.target.value) {
      return;
    }
    this.oldPlate = val.target.value;
    if (!val.target.value || val.target.value.length < 7) {
      return false;
    }
    this.searchVehicleCode.next(val.target.value);
    this.showLoading = true;
    this.showPlateImg = false;
    // this.cApi.customerVehicleVehicleLicenceGet(val.target.value).subscribe(data => {
    //   if (data.meta.code === 200) {
    //     this.customer = data.data;
    //   } else {
    //     alert(data.error.message);
    //   }
    // })
  }

  onSubmit(f) {
    // 正式员 or 临时工
    let type = this.employeeChecked ? '1' : '2';
    let data = Object.assign({}, this.business);
    // data.employeeChecked = this.employeeChecked;
    if (!this.onVehicleLicenceBlur() || !this.onBuinessItemBulr()) {
      return false;
    }
    if ( !this.business.employeeId || this.businessEmployeeErr ) {
      this.businessEmployeeErr = true;
      return false;
    } else {
      this.businessEmployeeErr = false;
    }
    if (data.employeeId === -1 && !data.employeeName && !data.employeeCode ) {
      this.addEmployeeErr = true;
      return false;
    } else {
      this.addEmployeeErr = false;
    }
    if (this.addEmployeeCodeErr) {
      return false;
    }

    this.loading = 1;

    data.shopId = Cookie.load('shopId');
    if (data.employeeId === -1) {

      this.eApi.employeeSavePost(this.business.employeeName || '', this.business.employeeCode || '', '', type).subscribe(res => {
        if (res.meta.code === 200) {
          data.employeeId = res.data.id;
          this.save(data);
        } else {
          // alert(res.error.message);
          if (res.error.message === '该技师编号已存在') {
            this.addEmployeeCodeErr = true;
          }
          this.loading = 0;
        }
      }, err => {
        this.loading = 0;
        console.error(err);
      });
    } else {
      this.save(data);
    }

  }

  save(data) {
    //payload: models.BusinessDetail
    this.bApi.businessSaveOrUpdatePost(data).subscribe(res => {
      this.loading = 0;
      if (res.meta.code === 200) {
        this.router.navigate(['/dashbroad/customer-detail',{id:res.data.customerId}]);
        this.onClose();
      } else {
        alert(res.error.message);
      }
    }, err => {
      this.loading = 0;
      console.error(err);
    });
  }

  onOpen(){
    this.businessShow = true;
    this.businessStr = Md5.hashStr(JSON.stringify(this.business)).toString();
    console.log(this.businessStr);
  }

  onClose() {
    this.showPlateImg = false;
    this.businessShow = false;
    this.plateErr = {
      empty: false,
      len: false
    };
    this.businessItemErr = false;
    this.businessEmployeeErr = false;
    this.addEmployeeErr = false;
    this.showLoading = false;
    this.confirmWinShow = false;
  }
  onVehicleLicenceFocus() {
    this.plateErr = {
      empty: false,
      len: false
    };
  }
  onVehicleLicenceBlur() {
    let plate = this.business.vehicleLicence;
    if (!plate) {
      this.plateErr.empty = true;
      this.showPlateImg = false;
      return false;
    }
    if (plate.length < 7 || plate.length > 9) {
      this.plateErr.len = true;
      this.showPlateImg = false;
      return false;
    }
    return true;
  }
  onBuinessItemBulr() {
    let item = this.business.name;
    if (!item) {
      this.businessItemErr = true;
      return false;
    }
    return true;
  }
  onBuinessItemFocus() {
    this.businessItemErr = false;
  }
  selectEmployee(evt) {
    console.log(evt === 'null');
    this.businessEmployeeErr = !evt || evt === 'null' ? true : false;
    console.log(this.businessEmployeeErr);
    this.business.employeeId = evt;
    this.employeeChecked = evt === 'other' ? true : false;
  }
  onAddEmpyeeFocus() {
    this.addEmployeeErr = false;
    this.addEmployeeCodeErr = false;
  }
  onUnsubmitClose() {
    let bs = Md5.hashStr(JSON.stringify(this.business)).toString();
    if ( this.businessStr === bs ) {
      this.onClose();
    } else {
      this.confirmWinShow = true;
    }

  }
  onConfirmOkey() {
    this.onClose();
  }
  onConfirmCancel() {
    this.confirmWinShow = false;
  }
}
