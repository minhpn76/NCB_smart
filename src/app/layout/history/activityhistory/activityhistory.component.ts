import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activityhistory',
  templateUrl: './activityhistory.component.html',
  styleUrls: ['./activityhistory.component.scss']
})
export class ActivityhistoryComponent implements OnInit {
  search: any = {
    keyword: '',
    create_from: 0,
    create_to: 0,
    page: 1,
    page_size: 50,
    total_items: 0,
    previous_page: 0,
    process_load: 0,
    process_export: 0,
    checkbox: 0,
    active: 1
  };
  constructor() { }

  ngOnInit() {
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      console.log('this.search---', this.search.keyword);
        // this.getListProvince(this.search);
    }
  }
  onSearch() {
    console.log('search', this.search);
  }

}
