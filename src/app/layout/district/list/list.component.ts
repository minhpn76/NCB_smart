import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'district-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

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
  listDistrict: any = [

  ];
  constructor() { }

  ngOnInit() {
    this.getListDistrict(this.search);
  }

  getListDistrict(params) {
    this.search.process_load = 1;
    // xu ly
    this.listDistrict = [{
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
    this.search.total_items = this.listDistrict.length;
    this.search.process_load = 0;

  }

  keyDownFunction(event) {

  }
  deleteDistrict(event, index) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.listDistrict.splice(index, 1);
        Swal.fire(
          'Đã xoá!',
          'Dữ liệu đã xoá hoàn toàn.',
          'success'
        );
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Huỷ bỏ',
          'Dữ liệu được bảo toàn :)',
          'error'
        );
      }
    });
  }
  cancelAction(event) {
    console.log('huy bo thanh con');

  }
  loadPage(page: number) {
    if (page !== this.search.previous_page) {
        this.search.previous_page = page;
        // this.getListDistrict(this.search);
    }
}

}
