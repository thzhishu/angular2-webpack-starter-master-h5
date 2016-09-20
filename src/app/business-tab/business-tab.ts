import { Component } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'business-tab',
  styles: [require('./business-tab.scss')],
  template: require('./business-tab.html')
})

export class BusinessTab {
    sub:string = '0002';
    constructor(private route: ActivatedRoute) {

    }
    ngOnInit() {
        // this.sub = this.route.snapshot.data['MeData'].data.roles[0].code;
    }
}
