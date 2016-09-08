import { Component, Input, Output, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { HTTP_PROVIDERS, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';
import { UserApi, CommonApi, ShopApi, User } from 'client';
import { Cookie } from 'services';

@Component({
  selector: 'register',
  directives: [
    ...ROUTER_DIRECTIVES
  ],
  template: require('./register.html'),
  styles: [require('./register.scss')],
  providers: [HTTP_PROVIDERS, UserApi, CommonApi, ShopApi, Md5, Cookie]
})
export class Register {
  zone: any;
  user: any = {protocol:true};
  seekDisabeld: number = 0;
  seekTime: number = 0;
  seekBtnTitle: any = '获取验证码';
  openProtocol: number = 0;
  img: any;
  timeout: any;
  sign: string;
  errorPhoneCode: string;
  errorMsg: string;
  loading: number = 0;
  openErrorProtocol: boolean = false;
  oldPhone: number;
  isCode: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private uApi: UserApi, private cApi: CommonApi, private sApi: ShopApi) {
    this.zone = new NgZone({ enableLongStackTrace: false }); //事务控制器
  }

  blur(data, e) {
    data.blur = e.type == 'blur';
  }

  //初始化
  ngOnInit() {
    this.getCodeImg();
  }

  ngOnDestroy() {
    window.clearInterval(this.timeout);
  }

  onInitError() {
    this.errorPhoneCode = null;
    this.errorMsg = null;
  }

  /**
   * 获取图片验证码
   * @return {[type]} [description]
   */
  getCodeImg() {
    this.cApi.commonCaptchaBase64Post().subscribe((data: Response) => {
      this.img = 'data:image/jpeg;base64,' + (data.text() || '');
      this.uApi.defaultHeaders.set('uuid', data.headers.get('uuid'));
      this.isCode = true;
    });
  }
  onChangeCode() {
    this.getCodeImg();
  }

  onOpenProtocol(e) {
    e.stopPropagation();
    this.openProtocol = 1;
  }

  onClose() {
    this.openProtocol = 0;
  }

  onChkPhone(e) {
    if (e.target.value === this.oldPhone) {

    } else {
      this.errorPhoneCode = '';
      this.oldPhone = e.target.value;
    }
  }

  onErrorClose() {
    this.openErrorProtocol = false;
  }

  chkRnd(e) {
    let rnd = e.target.value;
    let uuid = this.uApi.defaultHeaders.get('uuid');
    this.cApi.commonCaptchaValidateGet(uuid, rnd).subscribe(data => {
      this.zone.run(() => {
        this.isCode = data.meta&&data.meta.code == 200 ? false : true;
      });
    });
  }

  /**
   * 点击发送验证码
   * @param  {[type]} phone 手机号码
   * @param  {[type]} rnd   图片验证码
   * @return {[type]}       [description]
   */
  onSeekPhone(f) {
    this.errorMsg = null;
    if (this.seekDisabeld) {
      return;
    }
    if (this.errorSeekTip(f)) {
      this.getCodeImg();
      return false;
    }
    this.seekDisabeld = 1;
    this.seekTime = 60;
    this.timeout = window.setInterval(() => {
      this.zone.run(() => {
        if (this.seekTime > 1) {
          this.seekTime--;
          this.seekBtnTitle = this.seekTime + 's';
        } else {
          this.seekBtnTitle = '重新发送';
          this.seekDisabeld = 0;
          clearInterval(this.timeout);
        }
      });
    }, 1000);
    this.getPhoneCode(this.user.phone, this.user.rnd).subscribe(data => {
      if (data.meta&&data.meta.code !== 200) {
        clearInterval(this.timeout);
        this.errorMsg = data.error.message;
        this.getCodeImg();
        this.seekBtnTitle = '重新发送';
        this.seekDisabeld = 0;
      } else {
        // this.seekBtnTitle = '发送验证码';
        //倒计时
        // this.timeout = window.setInterval(() => {
        //   this.zone.run(() => {
        //     if (this.seekTime > 1) {
        //       this.seekTime--;
        //       this.seekBtnTitle = this.seekTime + 's';
        //     } else {
        //       this.seekBtnTitle = '重新发送';
        //       this.seekDisabeld = 0;
        //       clearInterval(this.timeout);
        //     }
        //   });
        // }, 1000);
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
    this.sign = Md5.hashStr(phone + rnd + salt).toString();
    return this.uApi.userRegisterSmsPost(phone, rnd, this.sign);
  }

  //注册
  onRegister(f) {
    if (this.errorTip(f)) {
      this.getCodeImg();
      return false;
    }
    this.loading = 1;
    let params = this.user;
    //mobile: string, password: string, code: string, captcha: string
    this.uApi.userRegisterPost(params.phone, Md5.hashStr(params.pwd, false).toString(), params.code, params.rnd)
      .subscribe((data) => {
        this.loading = 0;
        if (data.meta&&data.meta.code == 200) {
          Cookie.save('token', data.data.token, 14);
          Cookie.save('clientType', 'h5', 14);
          this.router.navigate(['/init']);
          //查询门店列表
        //   this.sApi.shopMyshopGet(data.data.token).subscribe(data => {
        //     if (data.meta&&data.meta.code === 200) {
        //       if (data.data.length > 0) {
        //         this.router.navigate(['/dashboard/business/list']);
        //       } else {
        //         this.router.navigate(['/init-store']);
        //       }
        //     } else {
        //       this.errorMsg = data.error.message;
        //     }
        //   });
        } else {
          this.errorMsg = data.error.message;
          this.getCodeImg();
        }
      })
  }

  toHome() {
    this.router.navigate(['']);
  }
  goBack() {
    window.history.back();
  }

  errorSeekTip(f) {
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
    this.errorMsg = null;
    return false;
  }

  errorTip(f) {
    if (f.controls.phone.errors && f.controls.phone.errors.required) {
      this.errorMsg = '手机号码不能为空';
      return true;
    }
    if (f.controls.phone.errors && f.controls.phone.errors.pattern) {
      this.errorMsg = '请输入正确的手机号码';
      return true;
    }
    if (f.controls.rnd.errors && f.controls.rnd.errors.required) {
    //   this.errorMsg = '验证码不能为空';
      this.errorMsg = '检验码不能为空';
      return true;
    }
    if (f.controls.code.errors && f.controls.code.errors.required) {
      this.errorMsg = '短信验证码不能为空';
      return true;
    }
    if (f.controls.pwd.errors && f.controls.pwd.errors.required) {
      this.errorMsg = '密码不能为空';
      return true;
    }
    if(f.value.pwd.length<6||f.value.pwd.length>16){
        this.errorMsg = '请输入由6~16位的英文字母,数字和符号组成的密码';
        return true;
    }
    if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(f.value.pwd)) {
        this.errorMsg = '请输入由6~16位的英文字母,数字和符号组成的密码';
        return true;
    }
    this.errorMsg = null;
    return false;
  }

}
