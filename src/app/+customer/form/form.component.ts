import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { CustomerApi, Customer } from 'client';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
    selector: 'customer-form',
    template: require('./form.template.html'),
    styles: [require('./form.style.scss')],
    //directives: [ROUTER_DIRECTIVES],
    providers: [CustomerApi ]
})
export class CustomerForm implements OnInit {
    customer: any = {
        id: '',
        vehicleLicence: '',
        mobile: '',
        vehicleFrame: '',
        name: '',
        birthYear: '',
        gender: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleMiles: '',
        valid: {
            plateNull: false,   // 此项为true
            plateExist: false,  // 此项为false
            mobile: true        // 此项为true可提交
        },
        validShowTip: {
            plate: false,
            mobile: false
        }
    };
    customerOldPlate: any;
    sub: any;
    tempPlate: string = '';
    plateStream = new Subject<string>();
    plateObservable: Observable<any> = this.plateStream.debounceTime(500).distinctUntilChanged().switchMap((term: string, i) => {
        console.log('plate keyup: ', term);
        return this.capi.customerVehicleVehicleLicenceGet(encodeURI(term));
    });

    birthdayYearArr: any[] = [];
    vehicleYearArr: any[] = [];
    miles: any[] = [];
    submiting: boolean = false;

    showTipWin: boolean = false;
    tipMsg: string = '';
    tipKey: string = '';
    tipOkeyBtnTxt: string = '确定';
    isAlert: boolean = false;
    oldFeildString: string = '';
    
    constructor( private capi: CustomerApi, private router: Router, private route: ActivatedRoute ) {
        const currentYear = +(new Date()).getFullYear();
		this.birthdayYearArr = this.rangeArr(currentYear - 60, currentYear - 16).reverse();
		this.vehicleYearArr = this.rangeArr(2006, currentYear).reverse();
		this.vehicleYearArr.push('2005年及以前');
		this.miles = [
			'5,000公里',
			'10,000公里',
			'15,000公里',
			'20,000公里',
			'25,000公里',
			'30,000公里',
			'35,000公里',
			'40,000公里',
			'45,000公里',
			'50,000公里',
			'55,000公里',
			'60,000公里',
			'65,000公里',
			'70,000公里',
			'75,000公里',
			'80,000公里',
			'85,000公里',
			'90,000公里',
			'95,000公里',
			'100,000公里及以上'
		];
    }

    ngOnInit() {
        this.oldFeildString = Md5.hashStr(JSON.stringify(this.customer), false).toString();
        this.sub = this.route.params.subscribe( params => {
            console.log('customer form params: ', params);
            if (params['id']) {
                this.getCustomerById(String(params['id']));
            }
        });
        this.plateObservable.subscribe( data => {
            if (data.meta&&data.meta.code === 200 ) {
                const val = this.customer.vehicleLicence;
                if (this.tempPlate === val) {
                    this.customer.valid.plateExist = data.data ? true : false;
                    // this.customer.validShowTip.plate = this.customer.valid.plateExist ? true : false;
                } else {
                    this.onPlateExist(this.customer.vehicleLicence);
                }
            }
                
        }, err => {
            console.error(err);
        } );
    }

    rangeArr (start, end) {
        return Array(end - start + 1).fill(0).map((v, i) => i + start);
    }

    getCustomerById(id) {
		this.capi.customerCustomerIdGet(id).subscribe(data => {
			if (data.meta&&data.meta.code === 200 && data.data) {
                if (data.data.vehicleYear === '2005') {
					data.data.vehicleYear = '2005年及以前';
				}
                this.customer = Object.assign(this.customer, data.data);
                this.formatCustomer();
                this.customerOldPlate = this.tempPlate = this.customer.vehicleLicence;
                this.customer.valid.plateNull = true;
                this.oldFeildString = Md5.hashStr(JSON.stringify(this.customer), false).toString();
            }
		}, err => console.error(err));
	}

    formatCustomer() {
        this.customer.birthYear = this.customer.birthYear === null ? '' : this.customer.birthYear;
        this.customer.gender = this.customer.gender === null ? '' : this.customer.gender;
        this.customer.vehicleYear = this.customer.vehicleYear === null ? '' : this.customer.vehicleYear;
        this.customer.vehicleMiles = this.customer.vehicleMiles === null ? '' : this.customer.vehicleMiles;
    }

    onPlateFocus() {
        this.customer.validShowTip.plate = false;
    }
    onPlateBlur() {
        const val = this.customer.vehicleLicence;
        if (!val || val.length < 7 || val.length > 9) {
            this.customer.valid.plateNull = false;
            //this.customer.validShowTip.plate = true;
            return false;
        }
    }
    onPlateExist(evt) {
        this.customer.vehicleLicence = evt;
        const val = this.customer.vehicleLicence;
        if (this.customerOldPlate && this.customerOldPlate === val) {
            this.customer.valid.plateExist = false;
            return true;
        }
        if ( val === this.tempPlate) return true;
        if (val.length > 6 && val.length < 10) {
            this.customer.valid.plateNull = true;
            this.tempPlate = val;
            this.plateStream.next(val);
        } else {
            this.customer.valid.plateNull = false;
            this.customer.valid.plateExist = false;
            this.customer.validShowTip.plate = false;
        }
    }
    onMobileFocus() {
        this.customer.validShowTip.mobile = false;
    }
    onMobileBlur() {
        const val = this.customer.mobile.trim();
        if (val === '' || /^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(val)) {
            this.customer.valid.mobile = true;
            this.customer.validShowTip.mobile = false;
        } else {
            this.customer.valid.mobile = false;
            // this.customer.validShowTip.mobile = true;
        }
    }

    goToListPage() {
        this.router.navigate(['/dashboard/customer/list']);
    }

    onSave() {
        if (this.submiting) return;
        const valid = this.customer.valid;
        if ( valid.plateNull === true && valid.plateExist === false && valid.mobile === true ) {
            const vals = this.customer;
            this.submiting = true;
            this.capi.customerSaveOrUpdatePost(
                vals.vehicleLicence,
                vals.id || '',
                vals.mobile || '',
                vals.vehicleFrame || '',
                vals.name || '',
                vals.birthYear || '',
                vals.gender || '',
                vals.vehicleBrand || '',
                vals.vehicleModel || '',
                vals.vehicleYear || '',
                vals.vehicleMiles || ''
            ).subscribe( data => {
                if (data.meta&&data.meta.code === 200) {
                    this.goToListPage();
                }
                this.submiting = false;
            }, err => {
                this.submiting = false;
                console.error(err);
            });
        } else {
            
            if (valid.plateNull !== true || valid.plateExist !== false) {
                this.customer.validShowTip.plate = true;
                return;
            }
            if (valid.mobile !== true) {
                this.customer.validShowTip.mobile = true;
            }
        }
    }

    back() {
        if (this.checkFormChange()) {
            window.history.back();
        } else {
            this.showTipWin = true;
            this.tipMsg = '当前页面尚有信息未保存，是否离开？';
            this.tipKey = 'back';
        }
        
    }
    checkFormChange() {
        const current = Md5.hashStr(JSON.stringify(this.customer), false).toString();
        return this.oldFeildString === current ? true : false;
    }
    onOkey(key) {
        if (key === 'back') {
            window.history.back();
            return;
        }
        if (key === 'delete-customer') {
            this.delCustomer();
            return;
        }
    }
    onCancel(key) {
        this.showTipWin = false;
        this.tipMsg = '';
        this.tipKey = '';
        this.tipOkeyBtnTxt = '确定';
    }

    onDeleteThisCustomer() {
        this.showTipWin = true;
        this.tipMsg = '顾客删除后，其相应的服务记录不会删除，是否继续？';
        this.tipKey = 'delete-customer';
        this.tipOkeyBtnTxt = '继续';
    }
    delCustomer() {
        this.capi.customerCustomerIdDeleteDelete(String(this.customer.id)).subscribe(data => {
            if (data.meta&&data.meta.code === 200) {
                this.onCancel('delete-customer');
                this.goToListPage();
            } else {
                this.onCancel('delete-customer');
            }
        }, err => console.error(err));
    }

    

}
