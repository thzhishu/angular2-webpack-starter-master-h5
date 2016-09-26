import { Component, OnInit, OnDestroy } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi, ShopApi } from 'client';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Md5 } from 'ts-md5/dist/md5';
import * as _ from 'lodash';

@Component({
    selector: 'employee-form',
    template: require('./form.template.html'),
    styles: [require('./form.style.scss')],
    //directives: [ROUTER_DIRECTIVES],
    providers: [EmployeeApi, ShopApi ]
})
export class EmployeeForm implements OnInit, OnDestroy {
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

    employeeShopStr: string = '请选择';

    // 关联门店弹出层
    showStoresLayer: boolean = false;
    storeTipMsg: string = '';
    storeValid: boolean = false;
    storeAll: boolean = false;
    layerStore = {
        stores: [],
        showStoresLayer: false,
        storeTipMsg: '',
        storeValid: false,
        storeAll: false
    }

    // 表单字段错误
    fieldErrMsg: string = '';

    // 删除弹出层
    showTipWin: boolean = false;
    tipMsg: string = '';
    tipKey: string = '';
    tipOkeyBtnTxt: string = '确定';
    isAlert: boolean = false;
    code: string;


    constructor( private eApi: EmployeeApi, private sApi: ShopApi,  private router: Router, private route: ActivatedRoute ) {
    }

    ngOnInit() {
        this.getAllStores();
        if (this.route.snapshot.data['MeData']) {
          if (this.route.snapshot.data['MeData'].meta.code === 401) {
            this.router.navigate(['/login']);
            return false;
          } else {
            this.code = this.route.snapshot.data['MeData'].data.roles[0].code;
          }
        }
    }

    ngOnDestroy() {
        this.sub && this.sub.unsubscribe();
    }

    /**
     * 通过Id获取员工
     */
    getEmployeeById(id) {
        this.eApi.employeeEmployeeIdGet('', id).subscribe(data => {
            if (data.meta && data.meta.code === 200 && data.data) {
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
                this.employeeShopStr = sp.length === 0 ? '请选择' : (sp.length > 1) ? `${sp[0].name}等${sp.length}家门店` : `${sp[0].name}`;
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

    /**
     * 处理保存员工信息后的响应
     */
    employeeRequestedHandler(data) {
        if (data.meta&&data.meta.code === 200) {
            this.router.navigate(['/dashboard/employee/list']);
        } else {
            if (data.error && data.error.message) {
                console.log('employee save error: ', data.error.message);
                this.fieldErrMsg = data.error.message;
            }
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
        if ( stores.length === 0 ) {
            if (isTip) {
                this.layerStore.storeTipMsg = '请选择关联门店';
                this.layerStore.storeValid = false;
            } else {
                this.employeeShopStr = '请选择';
                this.stores = _.cloneDeep(this.layerStore.stores);
                this.onHideStoreLayer();
            }
            return false;
        } else {
            if (this.employee.name === '') {
                let codes = stores.filter(store => store.code !== '');
                let codeErr = false;
                codes.forEach(store => {
                    if (store.code.indexOf(',') > -1) {
                        codeErr = true;
                        store.hasErr = true;
                    }
                });
                if (codeErr) {
                    this.layerStore.storeTipMsg = '员工编号中不可包含逗号';
                    this.layerStore.storeValid = false;
                    return false;
                }
                if (codes.length) {
                    this.employee.name = codes[0].code;
                }
            }
            this.layerStore.storeTipMsg = '';
            this.layerStore.storeValid = true;
            this.employeeShopStr = stores.length > 1 ? `${stores[0].name}等${stores.length}家门店` : `${stores[0].name}`;
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

}
