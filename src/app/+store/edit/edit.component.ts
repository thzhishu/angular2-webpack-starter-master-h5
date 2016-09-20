import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { CommonApi, ShopApi, RegionApi, RegionItem, Shop, MyAcountResponse, UserApi } from 'client';
import { Cookie } from '../../services';
import { StoreFormComponent } from '../form/form.component';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
    selector: 'store-edit',
    styles: [ require('./edit.style.scss') ],
    template: require('./edit.template.html'),
    //directives: [ROUTER_DIRECTIVES],
    providers: [ShopApi, UserApi]
})

export class StoreEditComponent implements OnInit {
    store: any;
    errMsg: string = '';
    submitting: boolean = false;
    sub: any;
    sign: string = '';
    timeout: any;
    errorPhoneCode: string;
    zone: any;
    isCurrentStore: boolean = false;
    id: any;

    showTipWin: boolean = false;
    tipMsg: string = '';
    tipKey: string = '';
    tipOkeyBtnTxt: string = '保存';
    isAlert: boolean = false;
    oldFeildString: string = '';
    isLeaveSave: boolean = false;

    showDelWin: boolean = false;
    defaultPhone: string = '';
    seekDisabeld: number = 0;
    seekTime: number = 0;
    seekBtnTitle: any = '获取验证码';
    phoneErrMsg: string = '';
    phoneCode: string = '';

    @ViewChild(StoreFormComponent) sf: StoreFormComponent;

    constructor(private router: Router, private route: ActivatedRoute, private sApi: ShopApi, private uApi: UserApi) {
        this.zone = new NgZone({ enableLongStackTrace: false });
    }
    ngOnInit() {
        this.store = {
            id: '',
            name: '',
            provinceId: '',
            cityId: '',
            districtId: '',
            address: '',
            serviceIds: '',
            ownerName: '',
            phone: '',
            openingDate: '',
            station: '',
            area: ''

        };
        this.isLeaveSave = false;
        this.sub = this.route.params.subscribe((params) => {
            console.log('id: ', params['id']);
            if (params['id']) {
                this.id = +params['id'];
                this.getStoreById(params['id']);
                this.getMe();
            }
        });
       
    }

    /**
     * 通过门店 Id 获取门店详细信息
     */
    getStoreById(id) {
        this.sApi.shopShopIdGet('', id).subscribe(data => {
            if (data.meta.code === 200 && data.data) {
                this.store = this.formatStoreInfo(data.data);
                console.log('edit store', this.store);
                this.sf.getCities(this.store.provinceId);
                this.sf.serviceListsHandle(this.store.serviceIds.split(','));
                this.oldFeildString = Md5.hashStr(JSON.stringify(this.store), false).toString();
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => console.error(err));
    }

    /**
     * 格式门店信息 null 值转为 空字符串
     */
    formatStoreInfo(data) {
        for (let key in data) {
            if (data[key] === null) {
                data[key] = '';
            }
        }
        return data;
    }

    /**
     * 更新门店
     */
    onSaveStore() {
        if (this.submitting) return;
        if (!this.sf.formFieldValidate()) return;
        let shops = [];
        this.store.area = Number(this.store.area);
        shops.push(this.store);
        this.submitting = true;
        this.sApi.shopUpdatePost(this.store).subscribe(data => {
            this.submitting = false;
            if (data.meta.code === 200) {
                this.isLeaveSave ? window.history.back() : this.router.navigate(['/dashboard/store/list']);
                this.isLeaveSave = false;
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => {
            console.error(err);
            this.submitting = false;
        });
    }

    /**
     * 点击返回时， 如果表单改动过则提示用户保存
     */
    onBack() {
        if (this.checkFormChange()) {
            window.history.back();
        } else {
            this.showTipWin = true;
            this.tipMsg = '您有信息未保存';
            this.tipKey = 'back';
            this.tipOkeyBtnTxt = '保存';
        }
    }

    /**
     * 检测表单有没有改动过
     */
    checkFormChange() {
        return this.oldFeildString === Md5.hashStr(JSON.stringify(this.store), false).toString();
    }


    /**
     * 点击发送验证码
     * @param  {[type]} phone 手机号码
     * @param  {[type]} rnd   图片验证码
     * @return {[type]}       [description]
     */
    onSeekPhone() {
        const phone = this.defaultPhone;
        const rnd = Math.floor(Math.random() * 9000 + 1000);
        if (this.seekDisabeld) {
            return;
        }
        if (!phone) {
            return;
        }
        if (!rnd) {
            return;
        }
        this.seekDisabeld = 1;
        this.seekBtnTitle = '发送中...';
        this.seekTime = 60;
        this.getPhoneCode(phone, String(rnd)).subscribe(data => {
        if (data.meta.code !== 200) {
            this.errorPhoneCode = data.error.message;
            this.seekBtnTitle = '重新发送';
            this.seekDisabeld = 0;
        } else {
            // 倒计时
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
        return this.sApi.shopDeleteSmsPost(phone, rnd, this.sign);
    }

    /**
     * 获取当前用户信息 
     */
    getMe() {
        this.uApi.userMeGet().subscribe( data => {
            if ( data.meta.code === 200 && data.data) {
                this.defaultPhone = data.data.user.mobile;
                this.isCurrentStore = this.id === data.data.user.lastShopId ? true : false;
            }
        }, err => console.error(err));
    }


    /**
     * 点保存 保存表单
     */
    onOkey(key) {
        if (key === 'back') {
            this.isLeaveSave = true;
            this.onCancel(key);
            this.onSaveStore();
            return;
        }
        
    }
    /**
     * 关闭弹出层
     */
    onCancel(key) {
        this.showTipWin = false;
        this.tipMsg = '';
        this.tipKey = '';
        this.tipOkeyBtnTxt = '确定';
    }

    /**
     * 点取消 直接离开
     */
    onLeave() {
        // window.history.back();
        this.router.navigate(['/dashboard/store/list']);
    }

    /**
     * 显示确认删除弹出层
     */
    onShowDelWin() {
        this.showDelWin = true;
    }
    /**
     * 隐藏确认删除弹出层
     */
    onCloseDelWin() {
        this.showDelWin = false;
        this.phoneErrMsg = '';
    }

    /**
     * 验证码输入框获取焦点
     */
    onPhoneCodeFocus() {
        this.phoneErrMsg = '';
    }

    /**
     * 删除门店
     */
    onDelStore() {
        if (this.submitting) return;
        if (this.phoneCode === '') {
            this.phoneErrMsg = '验证码不能为空';
            return;
        }
        this.submitting = true;
        this.sApi.shopDeleteDelete(String(this.id), this.phoneCode).subscribe(data => {
            this.submitting = false;
            if (data.meta.code === 200) {
                this.onCloseDelWin();
                // 刷新导航中的门店列表
                //this.thzsUtil.refreshShopList(true);
                this.router.navigate(['/dashboard/store/list']);
            } else {
                if (this.showDelWin) {
                    this.phoneErrMsg = data.error.message;
                }
            }
        }, err => {
            console.error(err);
            this.submitting = false;
        });

    }

    
}
