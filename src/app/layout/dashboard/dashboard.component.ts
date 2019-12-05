import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    userInfo: any;
    constructor(
        public router: Router,
    ) {
        this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
    }

    ngOnInit() {}
}
