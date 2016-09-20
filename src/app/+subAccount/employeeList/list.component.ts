import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi, EmployeeListItem } from 'client';

import * as _ from 'lodash';

@Component({
  selector: 'account-employee-list',
  template: require('./list.template.html'),
  styles: [require('./list.style.scss')],
  providers: [EmployeeApi]
})
export class AccountEmployeeList implements OnInit {
  page: any = { current: 1,limit:20,total:0 };
  employees: any[] = [];
  delEmployee: any;
  newSelectEmployee: EmployeeListItem;

  // 显示添加新技师层
  showAddEmployeeLayer: boolean = false;

  //滚动相关
  timeout: any;
  next: boolean = false;
  loading: boolean = false;
  end: boolean = false;
  isReturnTop: boolean = false;
  returnTop: boolean = false;

  // 删除弹出层
  showTipWin: boolean = false;
  tipMsg: string = '';
  tipKey: string = '';
  tipOkeyBtnTxt: string = '确定';
  isAlert: boolean = false;

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
    this.loading = true;

    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (scroll && !this.end) {
        this.page.current++;
      }
      this.eApi.employeeListGet(curPage, pageSize).subscribe(res => {
        if (res.meta && res.meta.code === 200 && res.data) {
          this.scrollLoading(scroll, res.data, this.employees, this.page.current, this.page.limit);
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
    console.log('cur:', this.currentEmployee)
    console.log('employee:', employee)
     if (this.currentEmployee && this.currentEmployee.id === employee.id) {
        // alert('重选吧');
        this.tipMsg = '该技师已被添加为子账号，请重新选择';
        this.tipKey = 'account-has';
        this.tipOkeyBtnTxt = '确认';
        this.isAlert = true;
        this.showConfirmLayer();
     } else {
       // this.currentEmployee = employee;
       this.tipMsg = '确认选择该技师？';
       this.tipKey = 'account-select';
       this.tipOkeyBtnTxt = '确认';
       this.isAlert = false;
       this.newSelectEmployee = employee;
       this.showConfirmLayer();
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

  /**
   * 显示 confirm 弹出层
   */
  showConfirmLayer() {
    this.showTipWin = true;
  }

  /**
   * 隐藏 confirm 弹出层
   */
  hideConfirmLayer() {
    this.showTipWin = false;
  }

  /**
   * 重置 confirm 弹出层
   */
  resetConfirmLayer() {
    this.showTipWin = false;
    this.tipMsg = '';
    this.tipKey = '';
    this.tipOkeyBtnTxt = '确定';
    this.isAlert = false;
  }

  /**
   * confirm 弹出层 okey
   */
  onOkey(key) {
    if (key === 'account-has') {
      this.resetConfirmLayer();
      this.hideConfirmLayer();
      return;
    }
    if ( key === 'account-select' ) {
      this.onChangeEmployee.emit(this.newSelectEmployee);
      this.resetConfirmLayer();
      this.hideConfirmLayer();
      return;
    }
  }

  /**
   * confirm 弹出层 cancel
   */
  onCancel(key) {
    if ( key === 'account-select' ) {
      this.newSelectEmployee = undefined;
      this.resetConfirmLayer();
      this.hideConfirmLayer();
      return;
    }
  }
}
