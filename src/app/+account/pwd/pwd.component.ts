import { Component, OnInit } from '@angular/core';
import { UserApi, CommonApi,UserResponse } from 'client';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
    selector: 'account-pwd',
    styles: [require('./pwd.style.scss')],
    template: require('./pwd.template.html'),
    //directives: [ROUTER_DIRECTIVES],
    providers: [UserApi, Md5]
})

export class AccountPwd {
    fieldErrMsg: string = '';
    oldPwd: string = '';
    newPwd: string = '';
    reNewPwd: string = '';
    submitting: boolean = false;

    showTipWin: boolean = false;
    tipMsg: string = '';
    tipKey: string = '';
    tipOkeyBtnTxt: string = '保存';
    isAlert: boolean = false;
    oldFeildString: string = '';
    isLeaveSave: boolean = false;

    constructor(private router: Router, private uApi: UserApi) {

    }

    ngOnInit() {
        this.isLeaveSave = false;
    }


    onSave() {
        if ( (this.fieldErrMsg !== '') || !this.checkPwd() ) return;
        if (this.submitting) return;
        let op = Md5.hashStr(this.oldPwd.trim(), false).toString();
        let np = Md5.hashStr(this.newPwd.trim(), false).toString();
        let rnp = Md5.hashStr(this.reNewPwd.trim(), false).toString();
        this.submitting = true;
        this.uApi.userChangePwdPost(op, np, rnp).subscribe((data:UserResponse) => {
            this.submitting = false;
            if (data.meta&&data.meta.code === 200) {
                if (data.data) {
                    this.isLeaveSave ? window.history.back() : this.router.navigate(['/dashboard/account/info']);
                }
            } else {
                this.fieldErrMsg = data.error.message;
            }
        }, err => console.error(err) );
    }

    onFieldFocus() {
        this.fieldErrMsg = '';
    }
    pwdFormat(str) {
        return /^[\x21-\x7E]{6,16}$/.test(str) ? true : false;
    }
    checkPwd() {
        let op = this.oldPwd.trim();
        let np = this.newPwd.trim();
        let rnp = this.reNewPwd.trim();
        if (op === '') {
            this.fieldErrMsg = '密码不能为空';
            return false;
        }
        if (!this.pwdFormat(op)) {
            this.fieldErrMsg = '请输入由6~16位的英文字母、数字或符号组成的密码';
            return false;
        }
        if (np === '') {
            this.fieldErrMsg = '密码不能为空';
            return false;
        }
        if (!this.pwdFormat(np)) {
            this.fieldErrMsg = '请输入由6~16位的英文字母、数字或符号组成的密码';
            return false;
        }
        if (rnp === '') {
            this.fieldErrMsg = '密码不能为空';
            return false;
        }
        if (!this.pwdFormat(rnp)) {
            this.fieldErrMsg = '请输入由6~16位的英文字母、数字或符号组成的密码';
            return false;
        }
        if (np !== rnp) {
            this.fieldErrMsg = '两次密码不一致，请重新输入';
            return false;
        }
        return true;
    }

    back() {
        if (!this.checkFormChange()) {
            window.history.back();
        } else {
            this.showTipWin = true;
            this.tipMsg = '您有信息未保存';
            this.tipKey = 'back';
            this.tipOkeyBtnTxt = '保存';
        }
    }

    checkFormChange() {
        return this.oldPwd !== '' || this.newPwd !== '' || this.reNewPwd !== '' ? true : false;
    }

    onOkey(key) {
        if (key === 'back') {
            //window.history.back();
            this.isLeaveSave = true;
            this.onCancel(key);
            this.onSave();
            return;
        }

    }
    onCancel(key) {
        this.showTipWin = false;
        this.tipMsg = '';
        this.tipKey = '';
        this.tipOkeyBtnTxt = '确定';
    }


}
