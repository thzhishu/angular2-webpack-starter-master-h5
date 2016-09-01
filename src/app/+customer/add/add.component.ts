import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { CustomerForm } from '../form/form.component';


@Component({
    selector: 'cutomer-add',
    template: require('./add.template.html'),
    styles: [require('./add.style.scss')],
    directives: [ROUTER_DIRECTIVES, CustomerForm]
})
export class CustomerAdd {
    constructor(private router: Router, private route: ActivatedRoute ) {

	}
}