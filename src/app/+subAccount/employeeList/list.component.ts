import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi } from 'client';

import * as _ from 'lodash';

@Component({
  selector: 'account-employee-list',
  template: require('./list.template.html'),
  styles: [require('./list.style.scss')],
  //directives: [...ROUTER_DIRECTIVES],
  providers: [EmployeeApi]
})
export class AccountEmployeeList implements OnInit {
  page: any = {};
  employees: any[] = [];
  showDelWin: boolean = false;
  delEmployee: any;
  //滚动相关
  timeout: any;
  next: boolean = false;
  loading: boolean = false;
  end: boolean = false;
  isReturnTop: boolean = false;
  returnTop: boolean = false;

  constructor(private eApi: EmployeeApi, private router: Router, private route: ActivatedRoute) {
    this.page.current = String(1);
    this.page.limit = String(20);
  }

  ngOnInit() {
    this.getEmployeeList(this.page.current, this.page.limit);
  }

  getEmployeeList(curPage, pageSize, scroll = false) {
    this.loading = true;

    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (scroll && !this.end) {
        this.page.current++;
      }
      this.eApi.employeeListGet(curPage, pageSize).subscribe(res => {
        if (res.meta && res.meta.code === 200 && res.data) {
          if (scroll) {
            this.employees = this.employees.concat(res.data);
          } else {
            this.employees = res.data;
          }
        } else {
          this.employees = [];
          this.end = true;
          alert(res.error.message);
        }
        this.loading = false;
        // if (data.meta && data.meta.code === 200 && data.data) {
        //   this.employees = data.data.length ? data.data : [];
        // } else {
        //   if (data.error && data.error.message) {
        //     console.log(data.error.message);
        //   }
        // }
      }, err => {
        console.error(err);
        this.employees = [];
      });
    }, 500);
  }


  onEditEmployee(employee, e) {
    e.stopPropagation();
    this.router.navigate(['/dashboard/employee/edit', employee.id]);
  }
  onAddNewEmployee() {
    this.router.navigate(['/dashboard/employee/add']);
  }

  //无限滚动
  onScrollEnd(next) {
    this.next = next;
    if (next && !this.loading) {
      this.getEmployeeList(this.page.current, this.page.limit, true);
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
  onSwipeLeft(event,listTbody) {
    event.preventDefault();
    console.dir(listTbody.children);
    _.forEach(listTbody.children,(val,i)=>{
        val.classList.remove('swipeleft');
    })
    event.target.parentNode.classList.add('swipeleft');
  }
  onSwipeRight(event,listTbody) {
    event.preventDefault();
    event.target.parentNode.classList.remove('swipeleft');
  }

  // onDelEmployee() {
  //     this.capi.customerCustomerIdDeleteDelete(String(this.delCustomer.id)).subscribe( data => {
  //         if (data.meta&&data.meta.code === 200) {
  //             this.onCloseDelWin();
  //             this.getCustomerList(this.page.current, this.page.limit);
  //         } else {
  //             if (data.error && data.error.message) {
  //                 console.log(data.error.message);
  //             }
  //         }
  //     }, err => {
  //         console.error(err);
  //     });
  // }
  // onCloseDelWin() {
  //     this.showDelWin = false;
  //     this.delEmployee = undefined;
  // }
  // onShowDelWin(employee, e) {
  //     e.stopPropagation();
  //     this.showDelWin = true;
  //     this.delEmployee = employee;
  // }
  // onViewCustomerDetail(customer, e) {
  //     e.stopPropagation();
  //     this.router.navigate(['/dashboard/customer/detail', customer.id]);
  // }
}
