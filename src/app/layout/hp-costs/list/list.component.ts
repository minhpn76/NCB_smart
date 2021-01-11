import { DecenModule } from './../../decen/decen.module';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';
import { NCBService } from '../../../services/ncb.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [NCBService]
})
export class ListComponent implements OnInit {
  re_search = {
    codeCost: '',
    status: 1,
    size: 10,
    page: 1,
    previous_page: 0
  };
  listStatus: any = [
    {
      name: 'Tất cả',
      code: null,
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
  listPageSize: any = [10, 20, 30, 40, 50];
  search_keyword: any = '';
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;
  listData: any[];


  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private orderPipe: OrderPipe
  ) {
    localStorage.setItem('redirect', 'false');
  }

  ngOnInit() {
     this.getListData(this.re_search);
  }
  loadPage(page: number)  {
    const page_number = page;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.onSearch(this.re_search);
    }
  }
  /*Câ[j nhat lại ham sert tai day] */
  onSearch(payload) {
    this.listData = [];
    this.isProcessLoad = 1;
    this.ncbService.getListHpCosts(payload).then(result => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body;
        this.totalSearch = body.total;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.listData = [];
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
  /*Đổi tên hàm serach trong NCB service */
  getListData(params) {
    this.listData = [];
    this.isProcessLoad = 1;
    this.ncbService.getListHpCosts(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body;
        this.totalSearch = body.total;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.isProcessLoad = 0;
      this.listData = [];
      this.totalSearch = 0;
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
  changePageSize() {}
  deleteItem(code) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.ncbService.deleteHpCosts(code).then(res => {
          if (res.json().code === '00') {
            // this.listData.splice(index, 1);
            Swal.fire(
              'Đã xoá!',
              'Dữ liệu đã xoá hoàn toàn.',
              'success'
            );
            this.onSearch(this.re_search);
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
}
