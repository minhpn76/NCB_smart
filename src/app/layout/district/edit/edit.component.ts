import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';


@Component({
  selector: 'province-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    districtId: any;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
    ) {
        this.route.params.subscribe(params => {
            this.districtId = parseInt(params.districtId);
        });
    }

  ngOnInit() {
    console.log('--districtId', this.districtId);

  }


}
