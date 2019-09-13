import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'bank-tranfer-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService]
})
export class ListComponent implements OnInit {
  search_keyword: any = '';
  search: any = {
    page: 0,
    size: 10,
    previous_page: 0,
  };
  isSearch: any = false;
  isProcessLoad: any = 0;
  re_search: any = {
    bankCode: '',
    status: '',
    page: 0,
    size: 10
  };
  totalSearch: any = 0;
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
      name: 'Inactive',
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
  }

  getListData(params) {
    this.listData = [];
    this.isProcessLoad = 1;
    // xu ly
    this.ncbService.searchBankTranfer(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.isProcessLoad = 0;
      this.listData = [];
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
        // tslint:disable-next-line:no-shadowed-variable
        this.ncbService.deleteBankTranfer({ bankCode: code }).then((result) => {
          if (result.status === 200) {
            if (result.json().code === '00') {
              this.listData.splice(index, 1);
              Swal.fire(
                'Đã xoá!',
                'Dữ liệu đã xoá hoàn toàn.',
                'success'
              );
            } else {
              this.toastr.error('Xoá thất bại', 'Lỗi hệ thống!');
            }
          } else {
            this.toastr.error('Xoá thất bại', 'Lỗi hệ thống!');
          }
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
  loadPage(page: number) {
    const page_number = page - 1;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.onSearch(this.re_search);
      this.re_search.page = page;
    }
  }
  onSearch(payload) {
    if (payload.bankCode !== '') {
      payload.page = 0;
    }
    this.getListData(payload);
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.isSearch = false;
      this.re_search.bankCode = this.search_keyword;
      this.getListData(this.re_search);
    }
  }
  changePageSize() {
    this.search.page = 0;
    this.isSearch = false;
    this.getListData(this.search);
  }

}
