import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { CustomerApi, Customer, BusinessApi } from 'client';
import { Md5 } from 'ts-md5/dist/md5';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'cutomer-detail',
  template: require('./detail.template.html'),
  styles: [require('./detail.style.scss')],
  providers: [CustomerApi, BusinessApi]
})
export class CustomerDetail implements OnInit {
  customerId: number;
  businessId: number;
  customerDetail: any;
  customer: any = {};
  histories: any = [];
  showCommentWin: Boolean = false;
  showDelWin: Boolean = false;
  historyRecord: any = {};
  sendErr: any = {
    mobile: false,
    times: false
  };
  hasSend: Boolean = false;
  sendTimes: number = 0;
  tempMobile: string = '';
  sub: any;
  page: any = { current: 1,limit:20,total:0 };
  commentUrl = {
    qrCode: '',
    url: ''
  };
  delRecord: any;
  next: number;
  isUnfold: boolean = false;
  pcHost: string = 'http://192.168.1.82:4444/#/survey-mobile;url=';
  sendBtnTxt: string = '立即发送';

  timeout: any;
  nextPage: boolean = false;
  loading: boolean = false;
  end: boolean = false;
  isReturnTop: boolean = false;
  returnTop: boolean = false;

  constructor(private cApi: CustomerApi, private router: Router, private route: ActivatedRoute, private bApi: BusinessApi) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      this.businessId = +params['bid'];

      this.getCustomerById(this.customerId);
      if (!this.customerId) {
        this.router.navigate(['/dashbroad/customer-list']);
      }
    });

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
  getCustomerById(id, scroll = false) {
    this.loading = true;
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (scroll && !this.end) {
        this.page.current++;
      }
      this.cApi.customerHistoryCustomerIdGet(id, this.page.current, this.page.limit).subscribe(data => {
        if (data.meta && data.meta.code === 200 && data.data) {
          this.customerDetail = data.data;
          this.customer = this.customerDetail.customers && this.customerDetail.customers.length ? this.customerDetail.customers[0] : {};

          this.customer = this.formatCustomer(this.customer);
          // this.thzsUtil.getCustomerInfo(this.customer);
          this.customerDetail.historiesTotol = data.meta.total;
          this.customerDetail.totalAvgScore = this.customerDetail.totalAvgScore ? this.customerDetail.totalAvgScore.toFixed(2) : 0;
          this.page.current = data.meta.current;
          this.page.limit = data.meta.limit;
          this.page.total = data.meta.total;
          this.page.pageTotal = Math.ceil(this.page.total / this.page.limit);
          this.scrollLoading(scroll,this.customerDetail.histories,this.histories,this.page.current,this.page.limit);
          if(!isNaN(this.businessId)){
              _.forEach(this.customerDetail.histories,(item,i)=>{
                  if(item.id === this.businessId){
                      this.onShowCommentWin(item);
                  }
              })
          }
        } else {
          //啥都没有
          this.customerDetail = {};
          this.end = true;
        }
        this.loading = false;
      }, err => {
        console.error(err);
        this.loading = false;
      });
    }, 500);
  }

  formatCustomer(customer) {
    const currentYear = (new Date()).getFullYear();
    customer.age = customer.birthYear ? (currentYear - customer.birthYear) : '';
    customer.sex = customer.gender === 0 ? '女' : customer.gender === 1 ? '男' : '';
    return customer;
  }

  moment(data, format) {
    return moment(data).format(format);
  }

  onToggleUnfold() {
    this.isUnfold = !this.isUnfold;
  }

  // 显示评价弹出层
  onShowCommentWin(record) {
    this.showCommentWin = true;
    this.historyRecord = record;
    this.historyRecord.hasSend = record.hasSend ? record.hasSend : false;
    this.hasSend = this.historyRecord.hasSend;
    this.historyRecord.times = record.times ? record.times : false;
    this.sendErr.times = this.historyRecord.times;
    if (this.hasSend) {
      this.sendBtnTxt = '重新发送';
    }
    if (this.historyRecord.url) {
      this.commentUrl.qrCode = this.historyRecord.qrCode;
      this.commentUrl.url = this.historyRecord.url;
    } else {
      this.bApi.businessBusinessIdUrlGet(record.id).subscribe(data => {
        if (data.meta && data.meta.code === 200) {
          this.commentUrl.qrCode = this.historyRecord.qrCode = data.data.qrCode;
          this.commentUrl.url = this.historyRecord.url = data.data.url;

        }

      }, err => console.error(err));
    }

  }
  // 关闭评价弹出层
  onCloseCommentWin() {
    this.showCommentWin = false;
    this.historyRecord = {};
    this.hasSend = false;
    this.sendErr.times = false;
    this.commentUrl.qrCode = '';
    this.commentUrl.url = '';
    this.sendBtnTxt = '立即发送';
    this.router.navigate(['/dashboard/customer/detail/'+this.customerId]);
  }

  onSend() {
    if (this.historyRecord.times) return false;
    this.sendMobile();
  }

  // 通过手机号发送
  sendMobile() {
    let mobile = this.customer.mobile || this.tempMobile;
    mobile = mobile.trim();
    if (mobile === '' || !(/^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(mobile))) {
      this.sendErr.mobile = true;
      return;
    }
    // 成功
    const rnd = Math.floor(Math.random() * 9000 + 1000);
    const salt = 'thzs0708';
    let sign = Md5.hashStr(mobile + rnd + salt).toString();
    this.bApi.businessBusinessIdCommentPost(this.historyRecord.id, mobile, rnd + '', sign).subscribe(data => {
      if (data.meta && data.meta && data.meta.code === 200) {
        this.hasSend = true;
        this.sendBtnTxt = '重新发送';
        this.historyRecord.hasSend = true;
        alert('发送成功');
      } else {
        if (data.error && data.error.code === 400401) {
          this.sendErr.times = true;
          this.historyRecord.times = true;
          this.historyRecord.hasSend = true;
        }
        // alert(data.error && data.error.message);
      }
    }, err => {
      console.error(err);
    });


  }

  // 评价弹出层电话输入框获取焦点
  onMobileFocus() {
    this.sendErr.mobile = false;
    this.sendErr.times = false;
  }

  onAddNewCustomer() {
    this.router.navigate(['/dashboard/business/add',this.customer.vehicleLicence]);
  }

  //无限滚动
  onScrollEnd(next) {
    this.nextPage = next;
    if (next && !this.loading) {
      this.getCustomerById(this.customerId, true);
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

  onListSwipeLeft(item) {
    item.swipeleft = 1;
  }
  onListSwipeRight(item) {
    item.swipeleft = 0;
  }

}
