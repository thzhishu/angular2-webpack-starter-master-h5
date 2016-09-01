import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { CustomerApi, Customer } from 'client';


@Component({
    selector: 'cutomer-list',
    template: require('./list.template.html'),
    styles: [require('./list.style.scss')],
    directives: [...ROUTER_DIRECTIVES],
    providers: [CustomerApi]
})
export class CustomerList implements OnInit {
    page: any = {};
    customers: Customer[] = [];
    showDelWin: boolean = false;
    delCustomer: any;
    constructor(private capi: CustomerApi, private router: Router, private route: ActivatedRoute) {
        this.page.current = String(1);
        this.page.limit = String(20);
    }

    ngOnInit() {
        this.getCustomerList(this.page.current, this.page.limit);
    }

    getCustomerList(curPage, pageSize) {
        this.capi.customerListGet(curPage, pageSize).subscribe( data => {
            if (data.meta.code === 200 && data.data) {
                this.customers = data.data.length ? data.data : [];
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => {
            console.error(err);
            this.customers = [];
        } );
    }
    onEditCustomer(customer, e) {
        e.stopPropagation();
        this.router.navigate(['/dashboard/customer/edit', customer.id]);
    }
    onAddNewCustomer() {
        this.router.navigate(['/dashboard/customer/add']);
    }
    onDelCustomer() {
        this.capi.customerCustomerIdDeleteDelete(String(this.delCustomer.id)).subscribe( data => {
            if (data.meta.code === 200) {
                this.onCloseDelWin();
                this.getCustomerList(this.page.current, this.page.limit);
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => {
            console.error(err);
        });
    }
    onCloseDelWin() {
        this.showDelWin = false;
        this.delCustomer = undefined;
    }
    onShowDelWin(customer, e) {
        e.stopPropagation();
        this.showDelWin = true;
        this.delCustomer = customer;
    }
    onViewCustomerDetail(customer, e) {
        e.stopPropagation();
        this.router.navigate(['/dashboard/customer/detail', customer.id]);
    }
}
