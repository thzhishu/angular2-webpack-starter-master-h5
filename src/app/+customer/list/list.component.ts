import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { CustomerApi, Customer } from 'client';

import * as _ from 'lodash';


@Component({
  selector: 'cutomer-list',
  template: require('./list.template.html'),
  styles: [require('./list.style.scss')],
  //directives: [...ROUTER_DIRECTIVES],
  providers: [CustomerApi]
})
export class CustomerList implements OnInit {
  page: any = { current: 1,limit:20,total:0 };
  customers: Customer[] = [];
  showDelWin: boolean = false;
  delCustomer: any;
  //滚动相关
  timeout: any;
  next: boolean = false;
  loading: boolean = false;
  end: boolean = false;
  isReturnTop: boolean = false;
  returnTop: boolean = false;

  constructor(private capi: CustomerApi, private router: Router, private route: ActivatedRoute) {
    this.page.current = String(1);
    this.page.limit = String(20);
  }

  ngOnInit() {
    this.getCustomerList(this.page.current, this.page.limit);
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
    if (input && input.length > 0) {
      if (input.length < limit) {
        this.end = true;
      }
      if (scroll) {
        _.assign(output,output.splice(((cur - 1) * limit), input.length, input)); //替换当前页面记录
      } else {
        _.assign(output , input);
      }
    } else {
      if (scroll) {

      } else {
        output = [];
      }
      this.end = true;
    }
  }

  getCustomerList(curPage, pageSize, scroll = false) {
    this.loading = true;

    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (scroll && !this.end) {
        this.page.current++;
      }
      this.capi.customerListGet(this.page.current, pageSize).subscribe(res => {
        this.scrollLoading(scroll,res.data,this.customers,this.page.current,this.page.limit);
        this.loading = false;
      }, err => {
        console.error(err);
        this.customers = [];
      });
    }, 500);
  }

  onEditCustomer(customer, e) {
    e.stopPropagation();
    this.router.navigate(['/dashboard/customer/edit', customer.id]);
  }
  onAddNewCustomer() {
    this.router.navigate(['/dashboard/customer/add']);
  }
  onDelCustomer() {
    this.capi.customerCustomerIdDeleteDelete(String(this.delCustomer.id)).subscribe(data => {
      if (data.meta && data.meta.code === 200) {
        this.onCloseDelWin();
        this.getCustomerList(this.page.current, this.page.limit);
      } else {
        if (data.error && data.error.message) {
          console.log(data.error.message);
        }
      }
    }, err => {
      console.error(err);
    });
  }
  onCloseDelWin() {
    this.showDelWin = false;
    this.delCustomer = undefined;
  }
  onShowDelWin(customer, e) {
    e.stopPropagation();
    this.showDelWin = true;
    this.delCustomer = customer;
  }
  onViewCustomerDetail(customer, e) {
    e.stopPropagation();
    this.router.navigate(['/dashboard/customer/detail', customer.id]);
  }

  //无限滚动
  onScrollEnd(next) {
    this.next = next;
    if (next && !this.loading) {
      this.getCustomerList(this.page.current, this.page.limit, true);
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
}
