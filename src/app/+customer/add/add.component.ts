import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'cutomer-add',
    template: require('./add.template.html'),
    styles: [require('./add.style.scss')],
    directives: [ROUTER_DIRECTIVES]
})
export class CustomerAdd {
    constructor(private router: Router, private route: ActivatedRoute ) {

	}
}