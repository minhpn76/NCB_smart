import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        public router: Router
    ) {
        this.redirectDashboard();
    }

    ngOnInit() {
    }

    redirectDashboard() {
        const isLoggedin = localStorage.getItem('isLoggedin');
        if (isLoggedin === 'false') {
            this.router.navigateByUrl('/login');
        }
        // } else {
        //     this.router.events.subscribe((res) => {
        //         if (this.router.url === '/login') {
        //             this.router.navigateByUrl('/dashboard');
        //         }
        //     });
        // }

    }
}
