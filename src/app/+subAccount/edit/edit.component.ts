import { Component, OnInit, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {  EmployeeListItem } from 'client';
import { SubAccountForm } from '../form/form.component';


@Component({
    selector: 'sub-account-edit',
    template: require('./edit.template.html'),
    styles: [require('./edit.style.scss')],
    //directives: [ROUTER_DIRECTIVES]
})
export class SubAccountEdit {

    // 控制员工列表层是否显示
    showEmployeeLayer: boolean = false;
    // 选中的技师
    selectedEmployee: EmployeeListItem;

    @ViewChild(SubAccountForm) saf: SubAccountForm;
    constructor(private router: Router, private route: ActivatedRoute ) {

	}

    

    /**
     * 显示 员工列表层
     */
    onShowEmployeeListLayer(show) {
        console.log('form employee', show);
        this.showEmployeeLayer = show ? true : false;
        
    }

    /**
     * 从员工列表中选来的员工
     */
    onChangeEmployee(data) {
        this.selectedEmployee = data;
        console.log('selectedEmployee', this.selectedEmployee);
        this.saf.onSetEmployeeName(data);
        this.showEmployeeLayer = false;
    }

    /**
     * 从 Form 表单中更新 选中的技师
     */
    onUpdateSelectEmployee(evt) {
        this.selectedEmployee = evt;
    }
}
