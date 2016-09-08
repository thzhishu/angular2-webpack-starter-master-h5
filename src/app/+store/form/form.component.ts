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
    //directives: [ROUTER_DIRECTIVES],
    providers: [CommonApi, ShopApi, RegionApi, UserApi, Md5]
})

export class StoreFormComponent implements OnInit {
    @Input() store;
    @Input() storePage;
    serviceLists = [];
    provinceList = [];
    cityList = [];
    openYears = [];
    stations = [];
    errMsg: string = '';

    constructor(
        private router: Router,
        private rApi: RegionApi,
        private cApi: CommonApi,
        private sApi: ShopApi,
        private uApi: UserApi
    ) {}

    ngOnInit() {
        this.initOpenYears();
        this.stations = this.rangeArr(1, 30);
        this.initServiceLists();
        this.getProvinces();
        console.log('form init');
    }

    /**
     * 初始化servicelist, 为每个元素添加 checked 属性
     */
    initServiceLists() {
        this.serviceLists = SERVICE_LIST;
        this.serviceLists.forEach( item => item.checked = false );
    }
    
    /**
     * 初始化开店年份 
     */
    initOpenYears() {
        const currentYear = +(new Date()).getFullYear();
        this.openYears = this.rangeArr(currentYear - 16, currentYear);
        this.openYears.reverse();
        this.openYears.push('1999年以前');
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
    getCities(id) {
        console.log(this.store.provinceId);
        this.rApi.regionProvinceIdCityGet(String(id)).subscribe(data => {
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
     * 计算数字区间
     */
    rangeArr (start, end) {
        return Array(end - start + 1).fill(0).map((v, i) => i + start);
    }

    /**
     * 验证表单项
     */
    formFieldValidate() {
        let s = this.store;
        if (s.name.trim() === '') {
            this.errMsg = '请填写门店名称';
            return false;
        }
        if (s.provinceId === '' || s.cityId === '' || s.address.trim() === '') {
            this.errMsg = '请完善门店地址';
            return false;
        }
        if (s.serviceIds.trim() === '') {
            this.errMsg = '服务类型不能为空';
            return false;
        }
        console.log('area: ', s.area, typeof(s.area));
        if (s.area !== '') {
            if ( !(/^\d+(\.\d+)?$/.test(s.area) && s.area >= 1 && s.area < 1000000000) ) {
                this.errMsg = '请输入大于0的数字';
                return false;
            }
        }
            
        return true;
    }



    /**
     * 服务项目取消或选中时，生成
     */
    onChangeService(service, evt) {
        service.checked = evt;
        this.errMsg = '';
        this.store.serviceIds = this.serviceLists.filter(item => item.checked)
                                                 .map(item => item.id)
                                                 .join(',');
    }

    /**
     * 根据省份的改变，获取新的城市列表
     */
    onChangeProvince(store, evt) {
        store.provinceId = evt;
        this.errMsg = '';
        store.cityId = '';
        if (store.provinceId === '') {
            this.cityList = [];
        } else {
            this.getCities(store.provinceId);
        }
    }

    /**
     * 城市切换
     */
    onChangeCity(store, evt) {
        store.cityId = evt;
        this.errMsg = '';
    }

    /**
     * 输入型字段获取焦点
     */
    onFieldFocus() {
        this.errMsg = '';
    }

}
