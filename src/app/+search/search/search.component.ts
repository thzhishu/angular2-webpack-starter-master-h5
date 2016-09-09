import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { CustomerApi, Customer, CustomerSearchResponse } from 'client';


@Component({
  selector: 'search-page',
  template: require('./search.template.html'),
  styles: [require('./search.style.scss')],
  //directives: [...ROUTER_DIRECTIVES],
  providers: [CustomerApi]
})
export class SearchPage implements OnInit {
  searchStr: string = '';
  showTipWin: boolean = false;
  tipMsg: string = '';
  tipKey: string = '';
  isAlert: boolean = false;
  searchHistories: string[] = [];
  showHistories: boolean = true;
  customers:any = [];
  constructor(private capi: CustomerApi, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    let hs = window.localStorage.getItem('thzs-search-histories');
    console.log('hs', hs);
    this.searchHistories = hs ? JSON.parse(hs) : [];
  }

  back() {
    window.history.back();
  }

  searchCustomer() {
    if (!this.searchStr || this.searchStr.length < 7) {
      this.showTipWin = true;
      this.tipMsg = '请输入正确的车牌号或手机号';
      this.tipKey = 'search';
      this.isAlert = true;
      return false;
    }
    console.log('searchStr', this.searchStr);
    this.setSearchHistory(this.searchStr);
    // this.router.navigate(['/dashboard/search/result', encodeURIComponent(this.searchStr)]);
    this.getSearchCustomers(encodeURIComponent(this.searchStr));


  }
  setSearchHistory(str) {
    let idx = this.searchHistories.indexOf(str);
    if (idx > -1) {
      this.searchHistories.splice(idx, 1);
    }
    this.searchHistories.unshift(str);
    this.searchHistories = this.searchHistories.slice(0, 10);
    window.localStorage.setItem('thzs-search-histories', JSON.stringify(this.searchHistories));

  }
  goSearch(hs) {
    this.searchStr = hs;
    this.searchCustomer();
  }
  onOkey(key) {
    if (key === 'search') {
      this.onCancel(key);
      return;
    }
    if (key === 'clear-history') {
      this.searchHistories = [];
      window.localStorage.removeItem('thzs-search-histories');
      this.onCancel(key);
      return;
    }
  }

  onChangeSearchStr(e) {
    this.searchStr = e;
    if (this.searchStr === '') {
      this.customers = [];
      this.showHistories = true;
      return;
    }
    if (this.customers.length) {
      this.customers = this.customers.filter(customer => customer.vehicleLicence.includes(this.searchStr) || customer.mobile.includes(this.searchStr));
      if (this.customers.length === 0) {
        this.showHistories = true;
      }
    } else {
      this.customers = [];
      this.showHistories = true;
    }
  }
  onCancel(key) {
    this.showTipWin = false;
    this.tipMsg = '';
    this.tipKey = '';
    this.isAlert = false;
  }
  onClearHistories() {
    this.showTipWin = true;
    this.tipMsg = '清除最近检索记录';
    this.tipKey = 'clear-history';
    this.isAlert = false;
  }
  onClearSearchStr() {
    this.searchStr = '';
    this.showHistories = true;
    this.customers = [];
  }

  getSearchCustomers(str) {
    console.log('customer search list....');
    this.capi.customerSearchPhoneOrVehicleLicenceGet(str).subscribe((data) => {
      if (data.meta && data.meta.code === 200 && data.data) {
        let dd = data.data;
        if (dd.length === 1) {
          this.router.navigate(['/dashboard/customer/detail', dd[0].id]);
        } else {
          this.customers = dd;
          this.showHistories = false;
        }
      } else {
        this.customers = [];
      }
    }, err => {
      console.error(err);
      this.customers = [];
    });
  }

  gotoBusinessAdd() {
    this.router.navigate(['/dashbroad/business/add']);
  }

  onViewCustomerDetail(customer, e) {
    e.stopPropagation();
    this.router.navigate(['/dashboard/customer/detail', customer.id]);
  }


}
