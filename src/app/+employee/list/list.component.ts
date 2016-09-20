import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi } from 'client';

import * as _ from 'lodash';

@Component({
  selector: 'employee-list',
  template: require('./list.template.html'),
  styles: [require('./list.style.scss')],
  providers: [EmployeeApi]
})
export class EmployeeList implements OnInit {
  page: any = { current: 1,limit:20,total:0 };
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
        output = [];
      }
      this.end = true;
    }
  }

  getEmployeeList(curPage, pageSize, scroll = false) {
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
      this.eApi.employeeListGet(this.page.current, pageSize).subscribe(res => {
        this.loading = false;
        if (res.meta && res.meta.code === 200) {
          this.scrollLoading(scroll, res.data, this.employees, this.page.current, this.page.limit);
        } else {
          this.employees = [];
          this.end = true;
          alert(res.error.message);
        }
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
  onSwipeLeft(index, items) {
    _.forEach(items, (val, i) => {
      val.swipeleft = 0;
    });
    items[index].swipeleft = 1;

  }
  onSwipeRight(index, items) {
    items[index].swipeleft = 0;
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
