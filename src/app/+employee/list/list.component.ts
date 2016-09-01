import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi } from 'client';


@Component({
    selector: 'employee-list',
    template: require('./list.template.html'),
    styles: [require('./list.style.scss')],
    directives: [...ROUTER_DIRECTIVES],
    providers: [EmployeeApi]
})
export class EmployeeList implements OnInit {
    page: any = {};
    employees: any[] = [];
    showDelWin: boolean = false;
    delEmployee: any;
    constructor(private eApi: EmployeeApi, private router: Router, private route: ActivatedRoute) {
        this.page.current = String(1);
        this.page.limit = String(20);
    }

    ngOnInit() {
        this.getEmployeeList(this.page.current, this.page.limit);
    }

    getEmployeeList(curPage, pageSize) {
        this.eApi.employeeListGet(curPage, pageSize ).subscribe(data => {
            if (data.meta.code === 200 && data.data) {
                this.employees = data.data.length ? data.data : [];
            } else {
                if (data.error && data.error.message) {
                    console.log(data.error.message);
                }
            }
        }, err => {
            console.error(err);
            this.employees = [];
        });
    }

    
    onEditEmployee(employee, e) {
        e.stopPropagation();
        this.router.navigate(['/dashboard/employee/edit', employee.id]);
    }
    onAddNewEmployee() {
        this.router.navigate(['/dashboard/employee/add']);
    }
    // onDelEmployee() {
    //     this.capi.customerCustomerIdDeleteDelete(String(this.delCustomer.id)).subscribe( data => {
    //         if (data.meta.code === 200) {
    //             this.onCloseDelWin();
    //             this.getCustomerList(this.page.current, this.page.limit);
    //         } else {
    //             if (data.error && data.error.message) {
    //                 console.log(data.error.message);
    //             }
    //         }
    //     }, err => {
    //         console.error(err);
    //     });
    // }
    // onCloseDelWin() {
    //     this.showDelWin = false;
    //     this.delEmployee = undefined;
    // }
    // onShowDelWin(employee, e) {
    //     e.stopPropagation();
    //     this.showDelWin = true;
    //     this.delEmployee = employee;
    // }
    // onViewCustomerDetail(customer, e) {
    //     e.stopPropagation();
    //     this.router.navigate(['/dashboard/customer/detail', customer.id]);
    // }
}
