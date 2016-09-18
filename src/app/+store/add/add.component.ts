import { Component, OnInit, ViewChild } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { CommonApi, ShopApi, RegionApi, RegionItem, Shop,MyAcountResponse,UserApi } from 'client';
import { Cookie } from '../../services';
import { StoreFormComponent } from '../form/form.component';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
    selector: 'store-add',
    styles: [ require('./add.style.scss') ],
    template: require('./add.template.html'),
    //directives: [ROUTER_DIRECTIVES],
    providers: [ShopApi]
})

export class StoreAddComponent implements OnInit {
    store: any;
    errMsg: string = '';
    submitting: boolean = false;

    showTipWin: boolean = false;
    tipMsg: string = '';
    tipKey: string = '';
    tipOkeyBtnTxt: string = '保存';
    isAlert: boolean = false;
    oldFeildString: string = '';
    isLeaveSave: boolean = false;

    @ViewChild(StoreFormComponent) sf: StoreFormComponent;

    constructor(private router: Router, private sApi: ShopApi) {

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
        this.oldFeildString = Md5.hashStr(JSON.stringify(this.store), false).toString();
    }

    /**
     * 新增门店
     */
    onSaveStore() {
        if (this.submitting) return;
        if (!this.sf.formFieldValidate()) return;
        let shops = [];
        shops.push(this.store);
        this.submitting = true;
        this.sApi.shopBatchSavePost(shops).subscribe(data => {
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
        window.history.back();
    }

    
}
