import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { EmployeeForm } from '../form/form.component';


@Component({
    selector: 'employee-edit',
    template: require('./edit.template.html'),
    styles: [require('./edit.style.scss')],
    directives: [ROUTER_DIRECTIVES, EmployeeForm]
})
export class EmployeeEdit {

}