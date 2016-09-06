import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'store-list',
    styles: [ require('./list.style.scss') ],
    template: require('./list.template.html'),
    directives: [ROUTER_DIRECTIVES],
    // providers: [CommonApi, ShopApi, RegionApi, UserApi, Md5]
})

export class StoreListComponent {
    constructor(private router: Router) {}

    /**
     * 去添加门店页面
     */
    onAddStore() {
        this.router.navigate(['/dashboard/store/add']);
    }
}
