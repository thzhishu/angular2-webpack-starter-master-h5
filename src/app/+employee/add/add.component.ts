import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { EmployeeForm } from '../form/form.component';


@Component({
    selector: 'employee-add',
    template: require('./add.template.html'),
    styles: [require('./add.style.scss')],
    directives: [ROUTER_DIRECTIVES, EmployeeForm]
})
export class EmployeeAdd {
    
    constructor(private router: Router, private route: ActivatedRoute ) {

	}
}