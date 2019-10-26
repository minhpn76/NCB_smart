import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'telecom-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService, ExcelService]
})
export class ListComponent implements OnInit {
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  search_keyword: any = '';
  arrExport: any = [];
  isProcessLoadExcel: any = 0;
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
      name: 'Deactive',
      code: 'D',
    }
  ];
  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private excelService: ExcelService
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
      this.listData = [];
      this.totalSearch = 0;
      this.toastr.error('Vui lòng thử lại', 'Lỗi hệ thống!');
    });

  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onSearch(this.re_search);
    }
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

  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }
  getDataExcel(search): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.ncbService.searchParamCallCenter(search)
        .then((result) => {
            this.arrExport = this.arrExport.concat(result.json().body.content);
            resolve();
          })
          .catch((err) => {
              resolve();
          });
    });
    return promise;
  }
  async exportExcel() {
    this.arrExport = [];
    this.isProcessLoadExcel = 1;
    const search = Object.assign({}, this.re_search);
    // search.size = 1000;
    // const page = Math.ceil(this.totalSearch / search.size);
    // search.page = 0;
    // await this.getDataExcel(search);
    const page = Math.ceil(this.totalSearch / search.size);

    for (let i = 0; i <= (page <= 0 ? 1 : page); i++) {
        search.page = i;
        await this.getDataExcel(search);
    }
    search.page = 0;
    const data = [];
    this.arrExport.forEach((element) => {
      data.push({
        'Mã nhà mạng': element.paramNo,
        'Tên nhà mạng': element.paramName,
        'Giá trị': element.paramValue,
        'Mô tả': element.note,
        'Trạng thái': element.status === 'A' ? 'Active' : 'Deactive',
      });
    });
    this.excelService.exportAsExcelFile(data, 'list_telecom');
    this.isProcessLoadExcel = 0;
    return;
  }

}
