import { Component, NgZone } from '@angular/core';
import {  Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Cookie } from 'services';

@Component({
	selector: 'home',
	styleUrls: [ './home.style.scss' ],
	template: require('./home.template.html'),
	providers: [Cookie]
	//directives: [ROUTER_DIRECTIVES]
})
export class Home {
	showMenu: boolean = false;
	showAboutUs: boolean = false;
	showContactUs: boolean = false;
	current: boolean = false;
	zone: any;
	body: any;
	constructor( private router: Router ) {
		this.zone = new NgZone({ enableLongStackTrace: false });
	}

	ngOnInit() {
		window.setInterval(() => {
			this.zone.run(() => {
				this.current = this.current ? false : true;
			});
		}, 5e3);
		this.body = document.getElementsByTagName('body')[0];
		this.body.removeEventListener('touchmove', this.preventScroll);
	}

	onToggleMenu() {
		this.showMenu = !this.showMenu;
		this.showMenu ? this.body.addEventListener('touchmove', this.preventScroll) : this.body.removeEventListener('touchmove', this.preventScroll);
	}

	onToggleAboutUs() {
		this.showAboutUs = !this.showAboutUs;
	}

	onToggleContactUs() {
		this.showContactUs = !this.showContactUs;
	}

	preventScroll(e) {
		e.preventDefault();
	}
	gotoRegister() {
		this.body.removeEventListener('touchmove', this.preventScroll);
		this.router.navigate(['/register']);
	}
	gotoLogin() {
		this.body.removeEventListener('touchmove', this.preventScroll);
		if (Cookie.load('token')) {
			if (localStorage.getItem('shopId')) {
				this.router.navigate(['/dashboard/business/list']);
			} else {
				this.router.navigate(['/init']);
			}
		} else {
			this.router.navigate(['/login']);
		}
	}

}
