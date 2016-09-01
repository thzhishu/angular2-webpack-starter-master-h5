import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { CustomerForm } from '../form/form.component';


@Component({
    selector: 'cutomer-edit',
    template: require('./edit.template.html'),
    styles: [require('./edit.style.scss')],
    directives: [ROUTER_DIRECTIVES, CustomerForm]
})
export class CustomerEdit {

}