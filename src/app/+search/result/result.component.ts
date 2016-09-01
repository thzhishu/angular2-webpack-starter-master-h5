import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { CustomerApi, Customer } from 'client';


@Component({
    selector: 'search-result',
    template: require('./result.template.html'),
    styles: [require('./result.style.scss')],
    directives: [...ROUTER_DIRECTIVES],
    providers: [CustomerApi]
})
export class SearchResult implements OnInit {
    constructor(private capi: CustomerApi, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        
    }

}
