import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi, ShopApi } from 'client';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
    selector: 'employee-form',
    template: require('./form.template.html'),
    styles: [require('./form.style.scss')],
    directives: [ROUTER_DIRECTIVES],
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

    constructor( private eApi: EmployeeApi, private sApi: ShopApi,  private router: Router, private route: ActivatedRoute ) {
    }

    ngOnInit() {
        this.getAllStores();
        this.oldEmployee = Md5.hashStr(JSON.stringify(this.employee), false).toString();
        this.sub = this.route.params.subscribe( params => {
            console.log('empolyee form params: ', params);
            if (params['id']) {
                this.getEmployeeById(String(params['id']));
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getEmployeeById(id) {
        this.eApi.employeeEmployeeIdGet('', id).subscribe(data => {
            if (data.meta.code === 200 && data.data) {
                console.log('edit', data);
                this.employee = data.data;
                this.oldEmployee = Md5.hashStr(JSON.stringify(this.employee), false).toString();
            }
        }, err => {
            console.error(err);
        });
    }

    getAllStores() {
        this.sApi.shopMyshopGet().subscribe((data) => {
            if (data.meta.code === 200 && data.data) {
                this.stores = data.data.length ? data.data : [];
                this.stores.forEach( store => {
                    store.code = '';
                });
            }
        });
    }

    

}
