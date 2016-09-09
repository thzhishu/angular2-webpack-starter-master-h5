import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { CustomerApi, Customer } from 'client';


@Component({
  selector: 'cutomer-list',
  template: require('./list.template.html'),
  styles: [require('./list.style.scss')],
  //directives: [...ROUTER_DIRECTIVES],
  providers: [CustomerApi]
})
export class CustomerList implements OnInit {
  page: any = {};
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

  getCustomerList(curPage, pageSize, scroll = false) {
    this.loading = true;

    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (scroll && !this.end) {
        this.page.current++;
      }
      this.capi.customerListGet(curPage, pageSize).subscribe(res => {
        if (res.meta && res.meta.code === 200) {
          if (res.data&&res.data.length>0) {
            if (scroll) {
              this.customers = this.customers.concat(res.data);
            } else {
              this.customers = res.data;
            }
          } else {
            if (scroll) {
              this.end = true;
            } else {
              this.customers = [];
            }
          }
        } else {
          alert(res.error.message);
        }
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
