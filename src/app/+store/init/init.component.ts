import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'store-init',
    styles: [ require('./init.style.scss') ],
    template: require('./init.template.html')
})

export class StoreInitComponent implements OnInit {
    store: any;
    constructor() {

    }
    ngOnInit() {
        this.store = {
            id: '',
            name: '',
            provinceId: '',
            cityId: '',
            districtId: '',
            address: '',
            serviceIds: '',
            ownerName: '',
            phone: '',
            openingDate: '',
            station: '',
            area: ''

        };
    }
}
