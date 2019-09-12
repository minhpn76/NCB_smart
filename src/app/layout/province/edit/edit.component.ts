import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';


@Component({
  selector: 'province-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  provisionId: any;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
    ) {
        this.route.params.subscribe(params => {
            this.provisionId = parseInt(params.provisionId);
        });
    }

  ngOnInit() {
    console.log('--provinceId', this.provisionId);

  }


}
