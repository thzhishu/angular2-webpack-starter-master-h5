import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {  EmployeeListItem } from 'client';


@Component({
    selector: 'sub-account-add',
    template: require('./add.template.html'),
    styles: [require('./add.style.scss')],
    //directives: [ROUTER_DIRECTIVES]
})
export class SubAccountAdd {

    // 控制员工列表层是否显示
    showEmployeeLayer: boolean = false;
    // 选中的技师
    selectedEmployee: EmployeeListItem;

    constructor(private router: Router, private route: ActivatedRoute ) {

	}

    /**
     * 显示 员工列表层
     */
    onShowEmployeeListLayer(show) {
        console.log('form employee', show);
        // this.showEmployeeLayer = show ? true : false;
    }
}
