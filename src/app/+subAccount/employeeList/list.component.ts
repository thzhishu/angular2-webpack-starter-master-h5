import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi, EmployeeListItem } from 'client';

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
  delEmployee: any;

  // 显示添加新技师层
  showAddEmployeeLayer: boolean = false;

  //滚动相关
  timeout: any;
  next: boolean = false;
  loading: boolean = false;
  end: boolean = false;
  isReturnTop: boolean = false;
  returnTop: boolean = false;

  @Input() currentEmployee: EmployeeListItem;
  @Output() onChangeEmployee = new EventEmitter();
  @Output() onShowEmployee = new EventEmitter();

  constructor(private eApi: EmployeeApi, private router: Router, private route: ActivatedRoute) {
    this.page.current = String(1);
    this.page.limit = String(20);
  }

  ngOnInit() {
    this.getEmployeeList(this.page.current, this.page.limit);
    console.log('employee list init');
    console.log(this.currentEmployee);
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
      }, err => {
        console.error(err);
        this.employees = [];
      });
    }, 500);
  }


  onAddNewEmployee() {
    this.showAddEmployeeLayer = true;
  }

  /**
   * 选择一个员工作为子账号
   */
  onSelectAccount(employee) {
     if (this.currentEmployee && this.currentEmployee.id === employee.id) {
       alert('重选吧');
     } else {
       // this.currentEmployee = employee;
       this.onChangeEmployee.emit(employee);
     }
  }
  /**
   * 关闭员工弹出层
   */
  onCloseEmployeeLayer() {
    this.onShowEmployee.emit(false);
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

  /**
   * 控制 添加新技师层的显示和隐藏
   */
  onToggleShowLayer(evt) {
    this.showAddEmployeeLayer = evt.hide == true ? false : true;
    if (evt.reload) {
      this.getEmployeeList(1, 20);
    }
  }

  
}
