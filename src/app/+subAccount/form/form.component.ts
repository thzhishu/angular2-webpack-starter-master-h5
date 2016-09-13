import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi, ShopApi, RoleApi, UserApi, EmployeeItem } from 'client';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Md5 } from 'ts-md5/dist/md5';
import * as _ from 'lodash';

@Component({
    selector: 'sub-account-form',
    template: require('./form.template.html'),
    styles: [require('./form.style.scss')],
    //directives: [ROUTER_DIRECTIVES],
    providers: [EmployeeApi, ShopApi, RoleApi, UserApi, Md5 ]
})
export class SubAccountForm implements OnInit, OnDestroy {
    sub: any;
    submiting: boolean = false;
    oldAccount: string = '';
    accountId: number;
    passwordPlaceholder: string = '必填项';
    isRequirePassword: boolean = true;

    selectEmployee = {
        id: '',
        name: '',
        mobile: ''
    };
    stores: any[] = [];

    // 账号对象
    account = {
        id: '',
        name: '',
        employeeId: '',
        mobile: '',
        password: '',
        roleIds: '',
        shopIds: '',
        roles: [],
        shops: []
    };
    // 角色
    roles = [];
    // 子账号关联门店字符串
    accountShopStr: string = '请选择';

    // employeeShopStr: string = '请选择';

    // 关联门店弹出层
    showStoresLayer: boolean = false;
    storeTipMsg: string = '';
    storeValid: boolean = false;
    storeAll: boolean = false;
    layerStore: any = {
        stores: [],
        showStoresLayer: false,
        storeTipMsg: '',
        storeValid: false,
        storeAll: false,
        showEmployeeCode: true
    }

    // 表单字段错误
    fieldErrMsg: string = '';

    // 删除弹出层
    showTipWin: boolean = false;
    tipMsg: string = '';
    tipKey: string = '';
    tipOkeyBtnTxt: string = '确定';
    isAlert: boolean = false;

    // 控制角色字段提示是否显示
    roleFieldTip: boolean = false;

    @Output() onShowEmployee = new EventEmitter();
    @Output() onUpdateSelectEmployee = new EventEmitter();

    constructor( private uApi: UserApi, private eApi: EmployeeApi, private sApi: ShopApi, private rApi: RoleApi,  private router: Router, private route: ActivatedRoute ) {
    }

    ngOnInit() {
        this.getRolesList();
        this.getAllStores();
    }

    ngOnDestroy() {
        this.sub && this.sub.unsubscribe();
    }

    /**
     * 获取所有的角色项
     */
    getRolesList() {
        this.rApi.roleListGet(1, 1000).subscribe(data => {
            if (data.meta.code === 200 && data.data) {
                this.roles = data.data.length > 0 ? data.data : [];
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => console.error(err));
    }

    /**
     * 保存子账号
     */
    onSubAccountSave() {
        if (this.submiting) return;
        let stores = this.stores.filter(store => store.checked);
        if (this.account.name === '') {
            this.fieldErrMsg = '员工姓名不能为空';
            return;
        }
        if (this.account.roleIds === '') {
            this.fieldErrMsg = '请选择账户角色';
            return;
        }
        if (stores.length === 0) {
            this.fieldErrMsg = '请选择关联门店';
            return;
        }
        if (this.account.mobile === '') {
            this.fieldErrMsg = '手机号码不能为空';
            return;
        }
        if (!(/^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(this.account.mobile))) {
            this.fieldErrMsg = '请输入正确的手机号码';
            return;
        }
        if (this.isRequirePassword && this.account.password === '') {
            this.fieldErrMsg = '密码不能为空';
            return;
        }
        if ( (this.account.password !== '') && !this.pwdFormat(this.account.password) ) {
            this.fieldErrMsg = '请输入由6~16位的英文字母、数字或符号组成的密码';
            return;
        }

        console.log('save account', this.account)
        
        this.fieldErrMsg = '';
        this.account.shopIds = stores.map(store => store.id).join(',');
        this.submiting = true;
        let ac = this.account;
        if (!this.account.id) {
            this.uApi.userAccountCreatePost( ac.mobile, Md5.hashStr(ac.password.trim(), false).toString(), ac.name, String(ac.employeeId), ac.roleIds, ac.shopIds ).subscribe(data => {
                this.submiting = false;
                this.employeeRequestedHandler(data);
            }, err => console.error(err));
        } else {
            let pwd = this.account.password === '' ? '' : Md5.hashStr(ac.password.trim(), false).toString();
            this.uApi.userAccountUpdatePost( ac.mobile, pwd, String(ac.id), ac.name, String(ac.employeeId), ac.roleIds, ac.shopIds ).subscribe(data => {
                this.submiting = false;
                this.employeeRequestedHandler(data);
            }, err => console.error(err));
        }
    }

    /**
     * 验证密码
     */
    pwdFormat(str) {
        return /^[\x21-\x7E]{6,16}$/.test(str) ? true : false;
    }

    /**
     * 处理保存员工信息后的响应
     */
    employeeRequestedHandler(data) {
        if (data.meta && data.meta.code === 200) {
            this.router.navigate(['/dashboard/account/subAccount/list']);
        } else {
            if (data.error && data.error.message) {
                console.log('account save error: ', data.error.message);
                this.fieldErrMsg = data.error.message;
            }
        }
    }

    

    

    /**
     * 获取所有门店
     */
    getAllStores() {
        this.sApi.shopMyshopGet().subscribe((data) => {
            if (data.meta&&data.meta.code === 200 && data.data) {
                this.stores = data.data.length ? data.data : [];
                this.stores.forEach( store => {
                    store.code = '';
                    store.checked = false;
                    store.hasErr = false;
                });
                this.initLayerStores();
                this.oldAccount = Md5.hashStr(JSON.stringify(this.account), false).toString();
                this.sub = this.route.params.subscribe( params => {
                    console.log('empolyee form params: ', params);
                    if (params['id']) {
                        this.accountId = +params['id'];
                        this.getAccountbyId(this.accountId);
                        
                    }
                });
            }
        });
    }

    /**
     * 获取子账号通过 id
     */
    getAccountbyId(id) {
        this.uApi.userAccountIdGet(id).subscribe(data => {
            if (data.meta.code === 200 && data.data) {
                this.passwordPlaceholder = '******';
                this.account = Object.assign(this.account, data.data);
                this.formatAccountInfo();
                this.initLayerStores();
                this.oldAccount = Md5.hashStr(JSON.stringify(this.account), false).toString();
                console.log('edit account', this.account);
            }
        }, err => console.error(err));
    }

    /**
     * 格式化账号信息
     */
    formatAccountInfo() {
        let storeNames = [];
        this.account.password = '';
        this.account.employeeId = this.account.employeeId ? this.account.employeeId : '';
        this.isRequirePassword = false;
        this.account.roleIds = this.account.roles[0];
        this.account.shopIds = this.account.shops.join(',');
        this.stores.forEach(store => {
            if (this.account.shops.indexOf(String(store.id)) > -1) {
                store.checked = true;
                storeNames.push(store.name);

            }
        });
        if (this.account.employeeId) {
            this.selectEmployee.id = this.account.employeeId;
            this.selectEmployee.name = this.account.name;
            this.selectEmployee.mobile = this.account.mobile;
        }
        
        this.accountShopStr = storeNames.length > 1 ? `${storeNames[0]}等${storeNames.length}家门店` : `${storeNames}`;
    }

    /**
     * 初始化门店弹出层
     */
    initLayerStores() {
        this.layerStore = {
            stores: _.cloneDeep(this.stores),
            showStoresLayer: false,
            storeTipMsg: '',
            storeValid: false,
            storeAll: false
        };
    }

    

    



    /**
     * 绑定显示关联门店弹出层
     */
    onSelectStore() {
        this.fieldErrMsg = '';
        this.onShowStoreLayer();
    }

    /**
     * 输入型字段获取焦点时清除错误信息
     */
    onFieldFocus() {
        this.fieldErrMsg = '';
    }

    /**
     * 显示关联门店弹出层
     */
    onShowStoreLayer() {
        this.layerStore.showStoresLayer = true;
    }

    /**
     * 隐藏关联门店弹出层
     */
    onHideStoreLayer() {
        this.layerStore.showStoresLayer = false;
    }
    /**
     * 点叉叉号关闭弹出层时，如果是编辑则直接关闭， 如果是新建则用户所选的有效
     */
    onCloseStoreLayer() {
        this.account.id ? this.onHideStoreLayer() : this.checkStoreLayer();
    }

    /**
     * 确认用户所选门店
     */
    selectAccountStores() {
        this.checkStoreLayer(true);
    }

    /**
     * 确认用户所选门店并格式化显示字符串
     */
    checkStoreLayer(isTip = false) {
        let stores = this.layerStore.stores.filter(store => store.checked);
        console.log('stores: ', stores);
        if ( stores.length === 0 ) {
            if (isTip) {
                this.layerStore.storeTipMsg = '请选择关联门店';
                this.layerStore.storeValid = false;
            } else {
                this.accountShopStr = '请选择';
                this.stores = _.cloneDeep(this.layerStore.stores);
                this.onHideStoreLayer();
            }
            return false;
        } else {
            this.layerStore.storeTipMsg = '';
            this.layerStore.storeValid = true;
            this.accountShopStr = stores.length > 1 ? `${stores[0].name}等${stores.length}家门店` : `${stores[0].name}`;
            this.stores = _.cloneDeep(this.layerStore.stores);
            this.account.shops = _.cloneDeep(stores);
            this.onHideStoreLayer();
            return true;
        }
    }

    /**
     * 选中或取消某一个门店回调
     */
    onCheckStore(store, evt) {
        store.checked = evt;
        if (store.checked) {
            this.layerStore.storeTipMsg = '';
        }
        this.account.shopIds = this.layerStore.stores.filter(store => store.checked).map(store=>store.id).join(',');
        console.log('change store account', this.account);
    }

    /**
     * 门店技工编号获取焦点
     */
    onStoreCodeFocus() {
        this.layerStore.storeTipMsg = '';
    }

    /**
     * 选择所有
     */
    onToggleStoreAll(evt) {
        this.layerStore.storeAll = evt;
        if (this.layerStore.storeAll) {
            this.layerStore.storeTipMsg = '';
        }
        this.layerStore.stores.forEach(store => {
            store.checked = this.layerStore.storeAll;
        });

    }

    /**
     * 门店技工编号失去焦点时删除其中的逗号
     */
    onStoreCodeBlur(store) {
        store.code = store.code.replace(/,/g, '').trim();
    }

    /**
     * 返回上一页
     */
    back() {
        // window.history.back()
        this.router.navigate(['/dashboard/account/subAccount/list']);
    }

    /**
     * 检查表单是否有改动
     */
    onGoBack() {
        let employee = Md5.hashStr(JSON.stringify(this.account), false).toString();
        this.oldAccount === employee ? this.back() : this.onShowSaveLayer();
    }

    /**
     * 显示删除员工弹出层
     */
    onShowSaveLayer() {
        this.tipMsg = '您有信息未保存';
        this.tipKey = 'save-account';
        this.tipOkeyBtnTxt = '保存';
        this.showConfirmLayer();
    }

    /**
     * 删除员工
     */
    delAccount() {
        this.uApi.userAccountIdDeleteDelete(Number(this.account.id)).subscribe(data => {
            if (data.meta.code === 200 ) {
                this.hideConfirmLayer();
                this.router.navigate(['/dashboard/account/subAccount/list']);
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => console.error(err));
    }

    /**
     * 显示删除员工弹出层
     */
    onShowDelAccountLayer() {
        this.tipMsg = '删除子账号后该账号将无法登录！';
        this.tipKey = 'del-account';
        this.tipOkeyBtnTxt = '删除';
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
        if (key === 'del-account') {
            this.delAccount();
            return;
        }
        if (key === 'save-account') {
            this.hideConfirmLayer();
            this.onSubAccountSave();
            return;
        }
    }

    /**
     * confirm 弹出层 点取消回调
     */
    onCancel(key) {
        if (key === 'del-account') {
            this.hideConfirmLayer();
            return;
        }

        if (key === 'save-account') {
            this.back();
            return;
        }

    }

    /**
     * 从技师列表中添加
     */
    onAddFromEmployee() {
        console.log('form employee');
        this.fieldErrMsg = '';
        this.onShowEmployee.next(true);
    }

    /**
     * 从技师列表中选择后，设置员工姓名
     */
    onSetEmployeeName(data) {
        this.clearAccountEmployeeInfo();
        this.account.name = data.name;
        this.account.employeeId = data.id;
        this.account.mobile = data.mobile;
        this.selectEmployee = data;
    }

    /**
     * 切换角色字段提示
     */
    onToggleRoleFieldTip() {
        this.roleFieldTip = !this.roleFieldTip;
    }

    /**
     * 账号姓名改变
     */
    onAccountNameChange(evt) {
        console.log(evt);
        console.log(this.account.name, this.account.employeeId);
        if (this.account.employeeId && this.account.name !== evt ) {
            this.clearAccountEmployeeInfo();
            // this.account.name = '';
        } else {
            this.account.name = evt;
        }
        
    }

    /**
     * 账号电话改变
     */
    onAccountMobileChange(evt) {
        if (this.account.employeeId && this.selectEmployee.mobile !== '' && this.account.mobile !== evt ) {
            this.clearAccountEmployeeInfo();
            // this.account.mobile = '';
        } else {
            this.account.mobile = evt;
        }
    }

    /**
     * 清除关联的技师信息
     */
    clearAccountEmployeeInfo() {
        this.account.employeeId = '';
        this.account.mobile = '';
        this.account.name = '';
        this.account.roleIds = '';
        this.account.shopIds = '';
        this.account.password = '';
        this.passwordPlaceholder = '必填项';
        this.accountShopStr = '请选择';
        this.isRequirePassword = true;
        this.stores.forEach(store => {
            store.code = '';
            store.checked = false;
            store.hasErr = false;
        });
        this.selectEmployee = undefined;
        this.initLayerStores();
        console.log('after clear account', this.account);
        this.onUpdateSelectEmployee.emit(undefined);
    }


}
