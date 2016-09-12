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
    oldEmployee: string = '';

    employee: any = {
        id: '',
        name: '',
        code: '',
        mobile: '',
        serviceTimes: 0,
        createTime: '',
        updateTime: '',
        shops: []
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
        shopIds: ''
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
        if (!(/^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(this.account.mobile)) {
            this.fieldErrMsg = '请输入正确的手机号码';
            return;
        }
        if (this.account.password === '') {
            this.fieldErrMsg = '密码不能为空';
            return;
        }
        if (!this.pwdFormat(this.account.password) ) {
            this.fieldErrMsg = '请输入由6~16位的英文字母、数字或符号组成的密码';
            return;
        }
        
        this.fieldErrMsg = '';
        this.account.shopIds = stores.map(store => store.id).join(',');
        this.submiting = true;
        let ac = this.account;
        if (!this.account.id) {
            this.uApi.userAccountCreatePost( ac.mobile, Md5.hashStr(ac.password.trim(), false).toString(), ac.name, Number(ac.employeeId), ac.roleIds, ac.shopIds ).subscribe(data => {
                this.submiting = false;
                this.employeeRequestedHandler(data);
            }, err => console.error(err));
        } else {
            this.uApi.userAccountUpdatePost( ac.mobile, Md5.hashStr(ac.password.trim(), false).toString(), String(ac.id), ac.name, String(ac.employeeId), ac.roleIds, ac.shopIds ).subscribe(data => {
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
            if (data.error && data.error.msg) {
                console.log('employee save error: ', data.error.msg);
            }
        }
    }

    

    /**
     * 通过Id获取员工
     */
    getEmployeeById(id) {
        this.eApi.employeeEmployeeIdGet('', id).subscribe(data => {
            if (data.meta && data.meta.code === 200 && data.data) {
                console.log('edit', data);
                this.employee = data.data;
                let sp = [];
                this.employee.shops.forEach(shop => {
                    this.stores.forEach(store => {
                        if (shop.shopId === store.id) {
                            store.checked = true;
                            store.code = shop.code;
                            sp.push(_.cloneDeep(store));
                        }
                    });
                });
                this.employee.shops = sp;
                console.log('shops: ', this.employee.shops);
                this.accountShopStr = sp.length === 0 ? '请选择' : (sp.length > 1) ? `${sp[0].name}等${sp.length}家门店` : `${sp[0].name}`;
                this.oldEmployee = Md5.hashStr(JSON.stringify(this.employee), false).toString();
                this.initLayerStores();
            }
        }, err => {
            console.error(err);
        });
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
                this.oldEmployee = Md5.hashStr(JSON.stringify(this.employee), false).toString();
                this.sub = this.route.params.subscribe( params => {
                    console.log('empolyee form params: ', params);
                    if (params['id']) {
                        this.getEmployeeById(String(params['id']));
                    }
                });
            }
        });
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
     * 保存员工信息
     */
    onSave() {
        if (this.submiting) return;
        let stores = this.stores.filter(store => store.checked);
        let noCodesArr = stores.filter(store => store.code === '');
        let haveCodeArr = stores.filter(store => store.code !== '');
        if (this.employee.name === '' && noCodesArr.length !== 0) {
            this.fieldErrMsg = '员工姓名与技师编号至少填一项';
            return;
        }
        if (stores.length === 0) {
            this.fieldErrMsg = '请选择关联门店';
            return;
        }
        if (this.employee.mobile !== '' && !(/^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(this.employee.mobile)) ) {
            this.fieldErrMsg = '请填写正确的手机号';
            return;
        }
        this.fieldErrMsg = '';
        stores = noCodesArr.concat(haveCodeArr);
        let shopIds = stores.map(store => store.id).join(',');
        let codes = stores.map(store => store.code).join(',');
        console.log('shopIds', shopIds, codes);
        this.submiting = true;
        if (!this.employee.id) {
            this.eApi.employeeSavePost( this.employee.name, this.employee.code, this.employee.mobile, shopIds, codes, '1' ).subscribe(data => {
                this.submiting = false;
                this.employeeRequestedHandler(data);
            }, err => console.error(err));
        } else {
            this.eApi.employeeUpdatePost( this.employee.id, this.employee.name, shopIds, codes, this.employee.code, this.employee.mobile ).subscribe(data => {
                this.submiting = false;
                this.employeeRequestedHandler(data);
            }, err => console.error(err));
        }

    }

    




    onSelectStore() {
        this.fieldErrMsg = '';
        this.onShowStoreLayer();
    }

    onFieldFocus() {
        this.fieldErrMsg = '';
    }

    onShowStoreLayer() {
        this.layerStore.showStoresLayer = true;
    }
    onHideStoreLayer() {
        this.layerStore.showStoresLayer = false;
    }
    onCloseStoreLayer() {
        this.employee.id ? this.onHideStoreLayer() : this.checkStoreLayer();
    }
    selectEmployeeStores() {
        this.checkStoreLayer(true);
    }

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
            this.employee.shops = _.cloneDeep(stores);
            this.onHideStoreLayer();
            return true;
        }
    }

    onCheckStore(store, evt) {
        store.checked = evt;
        if (store.checked) {
            this.layerStore.storeTipMsg = '';
        }
    }

    onStoreCodeFocus() {
        this.layerStore.storeTipMsg = '';
    }

    onToggleStoreAll(evt) {
        this.layerStore.storeAll = evt;
        if (this.layerStore.storeAll) {
            this.layerStore.storeTipMsg = '';
        }
        this.layerStore.stores.forEach(store => {
            store.checked = this.layerStore.storeAll;
        });

    }

    onStoreCodeBlur(store) {
        store.code = store.code.replace(/,/g, '').trim();
    }

    /**
     * 返回上一页
     */
    back() {
        window.history.back()
    }

    /**
     * 检查表单是否有改动
     */
    onGoBack() {
        let employee = Md5.hashStr(JSON.stringify(this.employee), false).toString();
        this.oldEmployee === employee ? this.back() : this.onShowSaveLayer();
    }

    /**
     * 显示删除员工弹出层
     */
    onShowSaveLayer() {
        this.tipMsg = '您有信息未保存';
        this.tipKey = 'save-employee';
        this.tipOkeyBtnTxt = '保存';
        this.showConfirmLayer();
    }

    /**
     * 删除员工
     */
    delEmployee() {
        this.eApi.employeeDeleteDelete(this.employee.id).subscribe(data => {
            if (data.meta.code === 200 ) {
                this.hideConfirmLayer();
                this.router.navigate(['/dashboard/employee/list']);
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
    onShowDelEmplyeeLayer() {
        this.tipMsg = '技师删除后，其历史服务记录不会被清除！';
        this.tipKey = 'del-employee';
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
        if (key === 'del-employee') {
            this.delEmployee();
            return;
        }
        if (key === 'save-employee') {
            this.hideConfirmLayer();
            this.onSave();
            return;
        }
    }

    /**
     * confirm 弹出层 点取消回调
     */
    onCancel(key) {
        if (key === 'del-employee') {
            this.hideConfirmLayer();
            return;
        }

        if (key === 'save-employee') {
            this.back();
            return;
        }

    }

    /**
     * 从技师列表中添加
     */
    onAddFromEmployee() {
        console.log('form employee');
        this.onShowEmployee.next(true);
    }

    /**
     * 从技师列表中选择后，设置员工姓名
     */
    onSetEmployeeName(data) {
        this.account.name = data.name;
        this.account.employeeId = data.id;
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
            this.account.name = '';
        } else {
            this.account.name = evt;
        }
        
    }

    /**
     * 清除关联的技师信息
     */
    clearAccountEmployeeInfo() {
        this.account.employeeId = '';
        this.account.mobile = '';
        this.account.name = '';
        this.onUpdateSelectEmployee.emit(undefined);
    }


}
