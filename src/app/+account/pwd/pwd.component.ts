import { Component } from '@angular/core';
import { UserApi, CommonApi } from 'client';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
    selector: 'account-pwd',
    styles: [require('./pwd.style.scss')],
    template: require('./pwd.template.html'),
    directives: [ROUTER_DIRECTIVES],
    providers: [UserApi, Md5]
})

export class AccountPwd {
    fieldErrMsg: string = '密码错误';
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

    constructor(private router: Router, private uApi: UserApi) {
        
    }

    back() {}
    onSave() {}

    onFieldFocus() {
        this.fieldErrMsg = '';
    }
}
