import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi } from 'client';

@Component({
  selector: 'forget-pwd',
  template: require('./forget-pwd.html'),
  styles: [require('./forget-pwd.scss')],
  directives: [...ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, UserApi, CommonApi, Md5],
})

export class ForgetPwd {
  zone: any;
  seekDisabeld: number = 0;
  seekTime: number = 0;
  seekBtnTitle: any = '获取验证码';
  next: number = 1;
  loading: number = 0;
  sign: string;
  img: any;
  diff: number = 0;
  timeout: any;
  errorMsg: string;
  openProtocol: boolean = false;
  fp: any = {};
  isCode: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi) {
    this.zone = new NgZone({ enableLongStackTrace: true }); // 事务控制器
  }
  // 初始化
  ngOnInit() {
    this.getCodeImg();
    // this.initForm();
  }

  onInitError() {
    this.errorMsg = null;
  }

  /**
   * 获取图片验证码
   * @return {[type]} [description]
   */
  getCodeImg() {
    this.cApi.commonCaptchaBase64Post().subscribe((data: Response) => {
      this.img = 'data:image/jpeg;base64,' + data.text();
      this.uApi.defaultHeaders.set('uuid', data.headers.get('uuid'));
      this.isCode = true;
    });
  }
  onChangeCodeImg() {
    this.getCodeImg();
  }

  blur(data, e) {
    data.blur = e.type == 'blur';
  }

  /**
   * 点击发送验证码
   * @param  {[type]} phone 手机号码
   * @param  {[type]} rnd   图片验证码
   * @return {[type]}       [description]
   */
  onSeekPhone(phone, rnd) {
    if (this.seekDisabeld) {
      return;
    }
    if (!phone) {
      return;
    }
    if (!rnd) {
      return;
    }
    this.errorMsg = null;
    this.seekDisabeld = 1;
    this.seekTime = 60;
    this.getPhoneCode(phone, rnd).subscribe(data => {
      if (data.meta.code !== 200) {
        this.errorMsg = data.error.message;
        this.seekBtnTitle = '重新发送';
        this.seekDisabeld = 0;
      } else {
        // this.seekBtnTitle = '发送验证码';
        //倒计时
        this.timeout = window.setInterval(() => {
          this.zone.run(() => {
            if (this.seekTime > 0) {
              this.seekBtnTitle = this.seekTime + 's';
              this.seekTime--;
            } else {
              this.seekBtnTitle = '重新发送';
              this.seekDisabeld = 0;
              clearInterval(this.timeout);
            }
          });
        }, 1000);
      }
    });
  }
  /**
   * 请求手机验证码
   * @param  {[type]} phone 手机号码
   * @param  {[type]} rnd   图片验证码
   * @return {[type]}       状态
   */
  getPhoneCode(phone: string = '', rnd: string = '') {
    let salt = 'thzs0708';
    this.sign = Md5.hashStr(phone + rnd + salt, false).toString();
    return this.uApi.userPasswordSmsPost(phone, rnd, this.sign);
  }
  //验证手机号
  onCheckPhone(f) {
    if (this.errorNext1Tip(f)) {
      return false;
    }
    this.loading = 1;
    let params = this.fp;
    params.uuid = this.uApi.defaultHeaders.get('uuid');
    // code: string, phone: string, uuid: string,
    this.cApi.commonCodeVerifyGet(params.code, params.phone, params.uuid).subscribe(data => {
      if (data.meta.code === 200) {
        this.next = 2;
        this.sign = data.data.sign;
      } else {
        this.errorMsg = data.error.message;
      }
      this.loading = 0;
    });
  }

  chkRnd(rnd) {
    if (rnd && rnd.length > 3) {
      let uuid = this.uApi.defaultHeaders.get('uuid');
      this.cApi.commonCaptchaValidateGet(uuid, rnd).subscribe(data => {
        this.isCode = data.meta.code == 200 ? false : true;
        if (data.meta.code !== 200) {
          this.errorMsg = data.error.message === '短信验证码超时，导致userId不存在' ? '您离开的时间太长，请重新操作' : data.error.message;
        }
      });
    }
  }

  // 重置密码
  onEditPwd(f) {
    if (this.errorNext2Tip(f)) {
      return false;
    }
    if(!this.sign){
        this.errorMsg = '您的验证码已超时';
        return false;
    }
    this.loading = 1;
    let params = f.value;
    // password: string, rePassword: string, sign: string
    this.uApi.userUpdatePwdPost(Md5.hashStr(params.pwd, false).toString(), Md5.hashStr(params.checkPwd, false).toString(), this.sign)
      .subscribe(data => {
        this.loading = 0;
        if (data.meta.code === 200) {
            this.next = 3;
        //   alert('密码修改成功');
        //   this.router.navigate(['/login']);
        } else {
          this.errorMsg = data.error.message;
        }
      });
  }

  onClose(key) {
    if (key === 'okey') {
      if (this.errorMsg === '短信验证码超时，导致userId不存在') {
        // this.router.navigate(['/login']);
        this.next = 1;
        this.getCodeImg();
      }
    }
    this.openProtocol = false;

  }

  toHome() {
    this.router.navigate(['']);
  }
  goBack() {
    window.history.back();
  }

  errorNext1Tip(f) {
    if (f.controls.phone.errors && f.controls.phone.errors.required) {
      this.errorMsg = '手机号码不能为空';
      return true;
    }
    if (f.controls.phone.errors && f.controls.phone.errors.pattern) {
      this.errorMsg = '请输入正确的手机号码';
      return true;
    }
    if (f.controls.rnd.errors && f.controls.rnd.errors.required) {
      this.errorMsg = '验证码不能为空';
      return true;
    }
    if (f.controls.code.errors && f.controls.code.errors.required) {
      this.errorMsg = '短信验证码不能为空';
      return true;
    }
    this.errorMsg = null;
    return false;
  }
  errorNext2Tip(f) {
    if (f.controls.pwd.errors && f.controls.pwd.errors.required) {
      this.errorMsg = '密码不能为空';
      return true;
    }
    if (!(/.{6,16}/.test(f.value.pwd))) {
      this.errorMsg = '请输入由6~16位的英文字母、数字或字符组成的密码';
      return true;
    }
    if (f.controls.checkPwd.errors && f.controls.checkPwd.errors.required) {
      this.errorMsg = '确认密码不能为空';
      return true;
    }
    if (!(/^.{6,16}$/.test(f.value.checkPwd))) {
      this.errorMsg = '请输入由6~16位的英文字母、数字或字符组成的密码';
      return true;
    }
    if(f.value.checkPwd!==f.value.pwd){
        this.errorMsg = '两次密码不一致,请重新输入';
        return true;
    }
    this.errorMsg = null;
    return false;
  }
}
