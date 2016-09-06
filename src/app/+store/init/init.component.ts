import { Component, OnInit, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { CommonApi, ShopApi, RegionApi, RegionItem, Shop,MyAcountResponse,UserApi } from 'client';
import { Cookie } from '../../services';
import { StoreFormComponent } from '../form/form.component';

@Component({
    selector: 'store-init',
    styles: [ require('./init.style.scss') ],
    template: require('./init.template.html'),
    directives: [ROUTER_DIRECTIVES],
    providers: [ShopApi]
})

export class StoreInitComponent implements OnInit {
    store: any;
    errMsg: string = '';
    submitting: boolean = false;
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
    }

    /**
     * 保存初始化门店
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
                Cookie.save('shopId', data && data[0].id);
                this.router.navigate(['/dashbroad/business/list']);
            } else {
                alert(data.error.message);
            }
        }, err => {
            console.error(err);
            this.submitting = false;
        });
    }

    
}
