import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
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
  page: any = {};
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

  showTipWin: boolean = false;
  tipMsg: string = '';
  tipKey: string = '';
  tipOkeyBtnTxt: string = '确定';
  isAlert: boolean = false;

  tempBusinessId: any;


  constructor(private cApi: CustomerApi, private router: Router, private route: ActivatedRoute, private bApi: BusinessApi) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      this.getCustomerById(this.customerId);
      if (!this.customerId) {
        this.router.navigate(['/dashbroad/customer-list']);
      }
    });

  }
  getCustomerById(id, scroll = false) {
    this.loading = true;
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      if (scroll && !this.end) {
        this.page.current += 1;
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
          if (this.customerDetail.histories && this.customerDetail.histories.length > 0) {
            if (scroll) {
              this.histories = this.histories.concat(this.customerDetail.histories || []);
            } else {
              this.histories = this.customerDetail.histories;
            }
          } else {
            this.histories = [];
            this.end = true;
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
    this.router.navigate(['/dashboard/customer/add']);
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
  onSwipeLeft(event, listTbody) {
    event.preventDefault();
    _.forEach(listTbody.children, (val, i) => {
      val.children[0].children[1] && val.children[0].children[1].classList.remove('swipeleft');
    })
    event.target.parentNode.parentNode.classList.add('swipeleft');
    // event.target.parentNode.parentNode.parentNode.parentNode.parentNode.children[1].children[0].children[1].classList.remove('swipeleft')
  }
  onSwipeRight(event, listTbody) {
    event.preventDefault();
    event.target.parentNode.parentNode.classList.remove('swipeleft');
  }

  // onPanUp(event, listTbody) {
  //   event.preventDefault();
  //   if (listTbody.scrollHeight == listTbody.scrollTop + listTbody.clientHeight) {
  //
  //     event.target.parentNode.parentNode.classList.add('panup');
  //     window.setTimeout(() => {
  //       event.target.parentNode.parentNode.classList.remove('panup');
  //     }, 1800);
  //   } else {
  //     event.target.parentNode.parentNode.classList.remove('panup');
  //   }
  // }

  /**
   * 删除指定的服务
   */
  delBusiness() {
    this.bApi.businessDeleteDelete(this.tempBusinessId).subscribe(data => {
      if (data.meta && data.meta.code === 200) {
        this.tempBusinessId = undefined;
        this.getCustomerById(this.customerId);
        this.hideConfirmLayer();
      } else {
        if (data.error && data.error.message) {
          console.log(data.error.message);
        }
      }
    }, err => {
      console.error(err);
    });
  }

  /**
   * 显示删除员工弹出层
   */
  onShowDelBusiness(id) {
      this.tipMsg = '确定删除该笔服务？';
      this.tipKey = 'del-business';
      this.tipOkeyBtnTxt = '确定';
      this.tempBusinessId = id;
      this.showConfirmLayer();
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
      this.tipMsg = '';
      this.tipKey = '';
      this.tipOkeyBtnTxt = '确定';
  }

  /**
   * confirm 弹出层 点确定回调
   */
  onOkey(key) {
      if (key === 'del-business') {
        this.delBusiness();
        return;
      }

  }

  /**
   * confirm 弹出层 点取消回调
   */
  onCancel(key) {
      if (key === 'del-business') {
        this.hideConfirmLayer();
        return;
      }
      
  }

}
