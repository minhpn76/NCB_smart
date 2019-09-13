import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'banner-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  search: any = {
    keyword: '',
    name_product_vn: '',
    name_product_en: '',
    page: 1,
    page_size: 10,
    total_items: 0,
    previous_page: 0,
    process_load: 0,
    process_export: 0,
    active: 2
  };
  listData: any = [];
  listPageSize: any = [10, 20, 30, 40, 50];
  listTypeService: any = [];

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
    this.getListProvince(this.search);
  }

  getListProvince(params) {
    this.search.process_load = 1;
    // xu ly
    this.listData = [{
        'name_vn': 'Ngân hàng điện tử',
        'name_en': 'Ebanking',
        'active': '1'
      },
      {
        'name_vn': 'Sản phẩm bảo hiểm',
        'name_en': 'Insurance',
        'active': '1'
      },
      {
        'name_vn': 'Sản phẩm dịch vụ thẻ',
        'name_en': 'Card banking',
        'active': '1'
      }
      ];
    this.search.total_items = this.listData.length;
    this.search.process_load = 0;

  }

  deleteItem(event, index) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.listData.splice(index, 1);
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
        // this.getProduct(this.search);
    }
  }
  onSearch() {
    console.log('search', this.search);
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      console.log('this.search---', this.search.keyword);
        // this.getListProvince(this.search);
    }
  }

}
