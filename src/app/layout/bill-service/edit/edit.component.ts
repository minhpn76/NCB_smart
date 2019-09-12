import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';


@Component({
  selector: 'billservice-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  billServiceId: any;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
    ) {
        this.route.params.subscribe(params => {
            this.billServiceId = parseInt(params.billServiceId);
        });
    }

  ngOnInit() {
    console.log('--billServiceId', this.billServiceId);

  }


}
