import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';


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
      name: 'Chờ duyệt',
      code: 'W',
    },
    {
      name: 'Hoạt động, đã duyệt',
      code: 'A',
    },
    {
      name: 'Xóa, hủy duyệt',
      code: 'D',
    }
  ];
  order = 'bankName';
  reverse = false;

  sortedCollection: any[];


  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private orderPipe: OrderPipe
  ) {
    this.sortedCollection = orderPipe.transform(this.listData, 'bankName');
  }

  ngOnInit() {
    this.getListData(this.re_search);

  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
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
      this.totalSearch = 0;
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
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
              Swal.fire(
                'Đã xoá!',
                'Dữ liệu đã xoá hoàn toàn.',
                'success'
              );
              this.re_search.page = 0;
              this.onSearch(this.re_search);
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
  deActiveItem(event, index, code) {
    Swal.fire({
      title: 'Bạn có chắc chắn thay đổi trạng thái?',
      text: 'Dữ liệu đã thay đổi trạng thái vẫn có thể sửa lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        // tslint:disable-next-line:no-shadowed-variable
        this.ncbService.deActiveBankTranfer({ bankCode: code }).then((result) => {
          if (result.status === 200) {
            if (result.json().code === '00') {
              Swal.fire(
                'Đã Deactive!',
                'Dữ liệu đã thay đổi.',
                'success'
              );
              this.re_search.page = 0;
              this.onSearch(this.re_search);
            } else {
              this.toastr.error('Deactive thất bại', 'Lỗi hệ thống!');
            }
          } else {
            this.toastr.error('Deactive thất bại', 'Lỗi hệ thống!');
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
  ActiveItem(event, index, code) {
    Swal.fire({
      title: 'Bạn có chắc chắn phê duyệt Ngân Hàng này?',
      text: 'Dữ liệu đã thay đổi trạng thái vẫn có thể sửa lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        // tslint:disable-next-line:no-shadowed-variable
        this.ncbService.ActiveBankTranfer({ bankCode: code }).then((result) => {
          if (result.status === 200) {
            if (result.json().code === '00') {
              Swal.fire(
                'Đã phê duyệt!',
                'Dữ liệu đã thay đổi.',
                'success'
              );
              this.re_search.page = 0;
              this.onSearch(this.re_search);
            } else {
              this.toastr.error('Phê duyệt thất bại', 'Lỗi hệ thống!');
            }
          } else {
            this.toastr.error('Phê duyệt thất bại', 'Lỗi hệ thống!');
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
      this.getListData(this.re_search);
      this.re_search.page = page;
    }
  }
  updateActiveItem(event, index, data) {
    Swal.fire({
      title: 'Bạn có chắc chắn thay đổi trạng thái?',
      text: 'Dữ liệu đã thay đổi trạng thái vẫn có thể sửa lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        // tslint:disable-next-line:no-shadowed-variable
        this.ncbService.updateBankTranfer({
          bankCode: data.bankCode,
          bankName: data.bankName,
          shtname: data.shtname,
          bin: data.bin,
          citad_gt: data.citad_gt,
          citad_tt: data.citad_tt,
          status: 'A'
        }).then(result => {
          if (result.json().code === '00') {
            Swal.fire(
              'Đã Active!',
              'Dữ liệu đã thay đổi.',
              'success'
            );
            this.re_search.page = 0;
            this.onSearch(this.re_search);

          } else {
            this.toastr.error('Active thất bại', 'Thất bại!');
          }
        }).catch(err => {
          this.toastr.error(err.json().desciption, 'Thất bại!');
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
  onSearch(payload) {
    if (payload.bankCode !== '' || payload.status !== '') {
      payload.page = 0;
    } else {
      payload.page = 0;
    }
    this.getListData(payload);
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onSearch(this.re_search);
    }
  }
  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

}
