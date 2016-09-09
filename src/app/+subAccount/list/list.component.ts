import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi } from 'client';

import * as _ from 'lodash';

@Component({
  selector: 'employee-list',
  template: require('./list.template.html'),
  styles: [require('./list.style.scss')],
  // directives: [...ROUTER_DIRECTIVES],
  providers: [EmployeeApi]
})
export class SubAccountList implements OnInit {
  page: any = {};
  employees: any[] = [];
  showDelWin: boolean = false;
  delEmployee: any;
  // 滚动相关
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
        this.page.current += 1;
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

  // 无限滚动
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
  // 返回头部
  onReturnTop() {
    this.returnTop = true;
  }
  // 滑动按钮
  onSwipeLeft(event, listTbody) {
    event.preventDefault();
    console.dir(listTbody.children);
    _.forEach(listTbody.children, (val, i) => {
        val.classList.remove('swipeleft');
    });
    event.target.parentNode.classList.add('swipeleft');
  }
  onSwipeRight(event, listTbody) {
    event.preventDefault();
    event.target.parentNode.classList.remove('swipeleft');
  }

  
}