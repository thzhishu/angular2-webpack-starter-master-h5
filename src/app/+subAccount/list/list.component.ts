import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
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
  page: any = { current: 1,limit:20,total:0 };
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
   * 无限加载 逻辑判断
   * @param  {[type]} scroll [是否滚动加载]
   * @param  {[type]} input  [输入]
   * @param  {[type]} output [输出]
   * @param  {[type]} cur    [当前页]
   * @param  {[type]} limit  [分页大小]
   * @return {[type]}        [description]
   */
  scrollLoading(scroll, input, output, cur, limit) {
    if (input && input.length > 0) {
      if (input.length < limit) {
        this.end = true;
      }
      if (scroll) {
        _.assign(output, output.splice(((cur - 1) * limit), input.length, input)); //替换当前页面记录
      } else {
        _.assign(output, input);
      }
    } else {
      if (scroll) {

      } else {
        output = [];
      }
      this.end = true;
    }
  }

  /**
   * 获取子账号列表
   */
  getAccountList(curPage, pageSize,scroll=false) {
    this.uApi.userAccountsGet(curPage, pageSize).subscribe(data => {
      if (data.meta.code === 200 && data.data) {
        // this.accounts = this.formatSubAccount(data.data);
        this.scrollLoading(scroll,this.formatSubAccount(data.data),this.accounts,curPage, pageSize);
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

  /**
   * 回到 账号列表页
   */
  goToAccountInfoPage() {
    this.router.navigate(['/dashboard/account/info']);
  }

  //滑动按钮
  onSwipeLeft(index, items) {
    _.forEach(items, (val, i) => {
      val.swipeleft = 0;
    });
    items[index].swipeleft = 1;

  }
  onSwipeRight(index, items) {
    items[index].swipeleft = 0;
  }

  //无限滚动
  onScrollEnd(next) {
    this.next = next;
    if (next && !this.loading) {
      this.getAccountList(this.page.current, this.page.limit,true);
    }
  }
  //滚动判断
  onScrollTop(returnTop) {
    this.isReturnTop = !returnTop; //返回头部是否显示
    this.returnTop = !!returnTop; //是否返回头部
  }
  //返回头部
  onReturnTop() {
    this.returnTop = true;
  }


}
