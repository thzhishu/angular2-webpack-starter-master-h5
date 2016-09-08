import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { ReportApi } from 'client';
import * as moment from 'moment';

@Component({
  selector: 'report-week',
  template: require('./week.template.html'),
  styles: [require('./week.style.scss')],
  //directives: [ROUTER_DIRECTIVES],
  providers: [ReportApi]
})
export class ReportWeek {
  goodColors = ['#70c042', '#a3ee12', '#a2e848', '#ecd136', '#f8ae5f', '#f89878', '#f88480', '#f85e62', '#f83b3c'];
  badColors = ['#02e1a3', '#36cea6', '#82b4aa', '#cb9baf', '#f88db5', '#de8cc3', '#b699d0', '#8cabdd', '#6fb6e5'];
  goodReasons = ['门店的会员优惠活动门店的会员优惠活动门店的会员优惠活动', '门店的会员优惠活动门店的会员优惠活动门店的会员优惠活动', '门店的会员优惠活动', '门店的会员优惠活动', '门店的会员优惠活动', '门店的会员优惠活动', '门店的会员优惠活动', '门店的会员优惠活动']
  start: string;
  end: string;
  percent: number = 0;
  shopGoods: string[] = [];
  shopBads: string[] = [];
  employeeGoods: any = [];
  employeeBads: any = [];
  improvements: any = [];
  page: any = {
    current: 1,
    pageSize: 10
  };

  //滚动相关
  timeout: any;
  next: boolean = false;
  loading: boolean = false;
  endScroll: boolean = false;
  isReturnTop: boolean = false;
  returnTop: boolean = false;

  constructor(private router: Router, private rApi: ReportApi) {
    this.end = moment().format('YYYY-MM-DD');
    this.start = (moment().subtract(7, 'days')).format('YYYY-MM-DD');
  }
  ngOnInit() {
    this.getWeekReport();
  }
  getWeekReport(scroll = false) {
    this.loading = true;

    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (scroll && !this.end) {
        this.page.current += 1;
      }
      this.page.current = this.page.current ? this.page.current : 1;
      this.rApi.reportAttitudeGet(this.start, this.end, this.page.current, 10).subscribe(res => {
        if (res.meta && res.meta.code === 200 && res.data) {
          if (scroll) {
            this.formatReportDataScroll(res);
          } else {
            this.formatReportData(res);
          }
        } else {
          this.endScroll = true;
          alert(res.error.message);
        }
        this.loading = false;
        // if (data.meta&&data.meta.code === 200 && data.data ) {
        // 	this.formatReportData(data);
        // }
      }, err => console.error(err));
    }, 500);
  }
  formatReportData(data) {
    const dd = data.data;
    this.percent = dd.percent;
    this.shopGoods = dd.shopGoods;
    this.shopBads = dd.shopBads;
    // this.employeeGoods = dd.employeeGoods;
    // this.employeeBads = dd.employeeBads;
    this.employeeGoods = this.employeeHandler(dd.employeeGoods);
    this.employeeBads = this.employeeHandler(dd.employeeBads);
    this.improvements = dd.improvements;
    this.page.current = data.meta.current;
    this.page.limit = data.meta.limit;
    this.page.total = data.meta.total;
    this.page.pageTotal = Math.ceil(this.page.total / this.page.limit);
  }
  formatReportDataScroll(data) {
    const dd = data.data;
    this.percent = dd.percent;
    this.shopGoods = dd.shopGoods;
    this.shopBads = dd.shopBads;
    // this.employeeGoods = dd.employeeGoods;
    // this.employeeBads = dd.employeeBads;
    this.employeeGoods = this.employeeHandler(dd.employeeGoods);
    this.employeeBads = this.employeeHandler(dd.employeeBads);
    this.improvements = this.improvements.concat(dd.improvements);
    this.page.current = data.meta.current;
    this.page.limit = data.meta.limit;
    this.page.total = data.meta.total;
    this.page.pageTotal = Math.ceil(this.page.total / this.page.limit);
  }
  employeeHandler(data) {
    let employee = {
      id: '',
      name: '',
      score: 0
    };
    let times = 3 - data.length > 0 ? (3 - data.length) : 0;
    for (let i = 0; i < times; i++) {
      data.push(employee);
    }
    return data;
  }

  //无限滚动
  onScrollEnd(next) {
    this.next = next;
    if (next && !this.loading) {
      this.getWeekReport(true);
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
