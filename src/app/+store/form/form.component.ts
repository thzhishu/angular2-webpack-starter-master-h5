import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { CommonApi, ShopApi, RegionApi, UserApi } from 'client';

const SERVICE_LIST = [
    { id: 1, name: '快修快保' },
    { id: 2, name: '美容改装' },
    { id: 3, name: '轮胎专项' },
    { id: 4, name: '综合维修' },
    { id: 5, name: '其他' }
];

@Component({
    selector: 'store-form',
    styles: [ require('./form.style.scss') ],
    template: require('./form.template.html'),
    directives: [ROUTER_DIRECTIVES],
    providers: [CommonApi, ShopApi, RegionApi, UserApi, Md5]
})

export class StoreFormComponent implements OnInit {
    @Input() store;
    serviceLists = [];
    provinceList = [];
    cityList = [];

    constructor(
        private router: Router,
        private rApi: RegionApi,
        private cApi: CommonApi,
        private sApi: ShopApi,
        private uApi: UserApi
    ) {}

    ngOnInit() {
        this.initServiceLists();
        this.getProvinces();
    }

    /**
     * 初始化servicelist, 为每个元素添加 checked 属性
     */
    initServiceLists() {
        this.serviceLists = SERVICE_LIST;
        this.serviceLists.forEach( item => item.checked = false );
    }

    /**
     * 获取省份
     */
    getProvinces() {
        this.rApi.regionProvinceGet().subscribe(data => {
            if (data.meta.code === 200) {
                this.provinceList = data.data;
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => console.error(err));
    }

    /**
     * 获取城市
     */
    getCities() {
        this.rApi.regionProvinceIdCityGet(String(this.store.provinceId)).subscribe(data => {
            if (data.meta.code === 200) {
                this.cityList = data.data;
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => console.error(err));
    }



    /**
     * 服务项目取消或选中时，生成
     */
    onChangeService(service, evt) {
        service.checked = evt;
        this.store.serviceIds = this.serviceLists.filter(item => item.checked)
                                                 .map(item => item.id)
                                                 .join(',');
    }

    /**
     * 根据省份的改变，获取新的城市列表
     */
    onChangeProvince(store, evt) {
        store.provinceId = evt;
        if (store.provinceId === '') {
            store.cityId = '';
            this.cityList = [];
        } else {
            this.getCities();
        }
    }

}
