import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'province-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService]
})
export class ListComponent implements OnInit {
  search_keyword: any = '';
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;
  re_search = {
    cityCode: '',
    cityName: '',
    status: '',
    size: 10,
    page: 0,
    previous_page: 0
  };

  selectProvine: any;
  listData: any = [];
  listProvinceName: any = [];
  listPageSize: any = [10, 20, 30, 40, 50];
  listStatus: any = [
    {
      name: 'Tất cả',
      code: '',
    },
    {
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Deactive',
      code: 'D',
    }
  ];

  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.getListData(this.re_search);
    // this.getProvinceName();
  }

  getListData(params) {
    this.listData = [];
    this.isProcessLoad = 1;
    // xu ly
    this.ncbService.searchProvince(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
    });
  }

  getProvinceName() {
    this.ncbService.searchProvince({}).then((result) => {
      result.json().body.content.forEach(element => {
        this.listProvinceName.push({
          id: element.cityId,
          name: element.cityName
        });
      });
    }).catch(err => {
    });
  }

  deleteItem(event, index, code) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.ncbService.deleteProvince({ cityId: code }).then(res => {
          if (res.json().code === '00') {
            this.listData.splice(index, 1);
            Swal.fire(
              'Đã xoá!',
              'Dữ liệu đã xoá hoàn toàn.',
              'success'
            );
          } else {
            this.toastr.error('Xoá thất bại', 'Thất bại');
          }
        }).catch(err => {

        });

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
    const page_number = page - 1;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.getListData(this.re_search);
      this.re_search.page = page;
    }
  }
  onSearch(payload) {
    payload.page = 0;
    this.getListData(payload);
  }
  // keyDownFunction(event) {
  //   if (event.keyCode === 13) {
  //     this.isSearch = false;
  //     this.re_search.cityCode = this.search_keyword;
  //     this.getListData(this.re_search);
  //   }
  // }
  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

}
