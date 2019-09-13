import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accesshistory',
  templateUrl: './accesshistory.component.html',
  styleUrls: ['./accesshistory.component.scss']
})
export class AccesshistoryComponent implements OnInit {
  search: any = {
    keyword: '',
    link: '',
    name_provision: '',
    page: 1,
    page_size: 10,
    total_items: 0,
    previous_page: 0,
    process_load: 0,
    active: 2
  };
  listProvision: any = [];
  listPageSize: any = [10, 20, 30, 40, 50];
  listStatus: any = [
    {
      name: 'Tất cả',
      code: 2,
    },
    {
      name: 'Active',
      code: 1,
    },
    {
      name: 'Deactive',
      code: 0,
    }
  ];

  constructor() { }

  ngOnInit() {
    this.getListProvision(this.search);
  }

  getListProvision(params) {
    this.search.process_load = 1;
    // xu ly
    this.listProvision = [{
        'city': 'Cần Thơ',
        'province': 'Cần Thơ',
        'area': '1,408.9',
        'population': '1,248,000'
      },
      {
          'city': 'Đà Nẵng',
          'province': 'Đà Nẵng',
          'area': '1,285.4',
          'population': '1,028,000'
      },
      {
          'city': 'Hải Phòng',
          'province': 'Hải Phòng',
          'area': '1,527.4',
          'population': '1,963,300'
      },
      {
          'city': 'Hà Nội',
          'province': 'Hà Nội',
          'area': '3,324.5',
          'population': '7,216,000'
      },
      {
          'city': 'Hồ Chí Minh',
          'province': 'Hồ Chí Minh',
          'area': '2,095.5',
          'population': '8,146,300'
      },
      {
          'city': 'Bà Rịa',
          'province': 'Bà Rịa–Vũng Tàu',
          'area': '91.46',
          'population': '122,424'
      },
      {
          'city': 'Bạc Liêu',
          'province': 'Bạc Liêu',
          'area': '175.4',
          'population': '188,863'
      },
      {
          'city': 'Bắc Giang',
          'province': 'Bắc Giang',
          'area': '32.21',
          'population': '126,810'
      },
      {
          'city': 'Bắc Ninh',
          'province': 'Bắc Ninh',
          'area': '80.28',
          'population': '272,634'
      },
      {
          'city': 'Bảo Lộc',
          'province': 'Lâm Đồng',
          'area': '232.56',
          'population': '153,362'
      },
      {
          'city': 'Biên Hòa',
          'province': 'Đồng Nai',
          'area': '264.07',
          'population': '1,104,495'
      },
      {
          'city': 'Bến Tre',
          'province': 'Bến Tre',
          'area': '67.48',
          'population': '143,312'
      }];
    this.search.total_items = this.listProvision.length;
    this.search.process_load = 0;

  }
  onSearch() {}

}
