import { Component } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { UserApi, MyAcountResponse } from 'client';

@Component({
  selector: 'business-tab',
  styles: [require('./business-tab.scss')],
  template: require('./business-tab.html')
})

export class BusinessTab {
  code: string = '0002';
  constructor(private router: Router, private route: ActivatedRoute,private uApi: UserApi) {

  }
  ngOnInit() {
      this.getMe();
  }

  getMe() {
    this.uApi.userMeGet().subscribe((res:MyAcountResponse) => {
      this.code = res.data.roles[0].code;
    })
  }
}
