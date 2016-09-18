import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'employee-add',
    template: require('./add.template.html'),
    styles: [require('./add.style.scss')],
    //directives: [ROUTER_DIRECTIVES]
})
export class EmployeeAdd {
    
    constructor(private router: Router, private route: ActivatedRoute ) {

	}
}