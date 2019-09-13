import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'telecom-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService]
})
export class ListComponent implements OnInit {
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  search_keyword: any = '';
  re_search: any = {
    paramNo: '',
    paramName: '',
    status: '',
    page: 0,
    size: 10,
    previous_page: 0
  };
  listData: any = [];
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
      name: 'Inactive',
      code: 'D',
    }
  ];
  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getListData(this.re_search);
  }

  getListData(params) {
    this.isProcessLoad = 1;
    // xu ly
    this.listData = [];
    this.ncbService.searchParamCallCenter(params).then((result) => {
      setTimeout(() => {
        this.isProcessLoad = 0;
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;

      }, 500);
    }).catch((err) => {
      this.isProcessLoad = 0;
      this.toastr.error('Vui lòng thử lại', 'Lỗi hệ thống!');
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
        this.ncbService.deleteParamCallCenter({ paramNo: code }).then((res) => {
          if (res.json().body === null) {
            this.toastr.error('Không thể xoá được dữ liệu', 'Lỗi!');
            return;
          }
          this.listData.splice(index, 1);
          Swal.fire(
            'Đã xoá!',
            'Dữ liệu đã xoá hoàn toàn.',
            'success'
          );
          setTimeout(() => {
            this.re_search.page = 0;
            this.getListData(this.re_search);
          }, 500);
        });

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

  loadPage(page: any) {
    const page_number = page - 1;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.onSearch(this.re_search);
      this.re_search.page = page;
    }
  }
  changeSize(size: number) {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

  onSearch(params) {
    // date
    if (params.paramNo !== '' || params.paramName !== '' || params.status !== '') {
      params.page = 0;
    }
    this.getListData(params);
  }
  exportExcel() {

  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.isSearch = false;
      this.re_search.filter = this.search_keyword;
      this.getListData(this.re_search);
    }
  }
  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

}
