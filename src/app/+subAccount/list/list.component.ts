import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { EmployeeApi, UserApi } from 'client';
import { Cookie } from 'services';
import * as _ from 'lodash';

@Component({
  selector: 'sub-account-list',
  template: require('./list.template.html'),
  styles: [require('./list.style.scss')],
  // directives: [...ROUTER_DIRECTIVES],
  providers: [EmployeeApi, UserApi, Cookie]
})
export class SubAccountList implements OnInit {
  page: any = {};
  employees: any[] = [];
  showDelWin: boolean = false;
  delEmployee: any;
  // 滚动相关
  timeout: any;
  next: boolean = false;
  loading: boolean = false;
  end: boolean = false;
  isReturnTop: boolean = false;
  returnTop: boolean = false;

  // 账号
  accounts = [];


  constructor(private eApi: EmployeeApi, private router: Router, private route: ActivatedRoute, private uApi: UserApi) {
    this.page.current = String(1);
    this.page.limit = String(20);
  }

  ngOnInit() {
    this.getAccountList(this.page.current, this.page.limit);
  }

  /**
   * 获取子账号列表
   */
  getAccountList(curPage, pageSize) {
    this.uApi.userAccountsGet(curPage, pageSize).subscribe(data => {
      if (data.meta.code === 200 && data.data) {
        this.accounts = this.formatSubAccount(data.data);
      } else {
        if (data.error && data.error.message) {
          console.log(data.error.message);
        }
      }
    }, err => console.error(err));
  }

	/**
	 * 格式化子账号列表
	 */
	formatSubAccount(data) {
		let ret = _.cloneDeep(data);
		let currentShopId = Cookie.load('shopId');
		ret.forEach( list => {
			let shopIds = [],
				shopNames = [],
				idx = -1;

			list.roleStr = list.roles.map( item => item.name).join(',');
			list.shops.forEach( shop => {
				shopIds.push(shop.id);
				shopNames.push(shop.name);
			});
			idx = shopIds.indexOf(currentShopId);
			list.shopStr = idx > -1 ? this.createShopNameStr(shopNames, shopNames[shopIds.indexOf(currentShopId)]) : this.createShopNameStr(shopNames);
		});
		return ret;
	}

  /**
   * 创建格式化的关联门店名
   */
  createShopNameStr(shopNames, name = '') {
	  let ret = '';
	  if (shopNames.length === 1) {
		  ret = shopNames[0];
	  } else {
		  ret = name === '' ? `${shopNames[0]}等${shopNames.length}家门店` : `${name}等${shopNames.length}家门店`;
	  }
	  return ret;
  }

  


  onEditAccount(account, e) {
    e.stopPropagation();
    this.router.navigate(['/dashboard/account/subAccount/edit', account.id]);
  }
  onAddNewAccount() {
    this.router.navigate(['/dashboard/account/subAccount/add']);
  }

  

  
}
