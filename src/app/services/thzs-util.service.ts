import { Injectable }    from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class ThzsUtil {
    // public shopChanged$: Observable<number>;
    // public customerInfo$: Observable<any>;
    public refreshShopList$: Observable<any>;
    public refreshBusinessList$: Observable<any>;
    // public currentShopInfo: any;
    // public currentCustomerInfo: any;
    // private shopChangedSource = new Subject<number>();
    // private customerInfoSource = new Subject<any>();
    private refreshShopListSource = new Subject<any>();
    private refreshBusinessListSource = new Subject<any>();

    constructor () {
    //    this.shopChanged$ = this.shopChangedSource.asObservable();
    //    this.customerInfo$ = this.customerInfoSource.asObservable();
       this.refreshShopList$ = this.refreshShopListSource.asObservable();
       this.refreshBusinessList$ = this.refreshBusinessListSource.asObservable();
    }
    // changeShop(id) {
    //     console.log('changeShop: ', id);
    //     this.shopChangedSource.next(id);
    // }
    // getCustomerInfo(info: any) {
    //     console.log('customer info', info);
    //     this.customerInfoSource.next(info);
    // }
    refreshShopList(op: any) {
        this.refreshShopListSource.next(op);
    }
    refreshBusinessList(op: any) {
        this.refreshBusinessListSource.next(op);
    }
}
