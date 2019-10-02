import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'notify-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService, ExcelService]
})
export class ListComponent implements OnInit {
  search_keyword: any = '';
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;
  arrExport: any = [];
  isProcessLoadExcel: any = 0;
  tempType: any = '';
  re_search = {
    provider: '',
    type: '',
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
  listType: any = [
    {
      name: 'IBT',
      code: 'CK liên ngân hàng'
    },
    {
      name: 'URT',
      code: 'CK nội bộ'
    },
    {
      name: 'ISL',
      code: 'CK 247'
    },
    {
      name: 'OW6',
      code: 'Gửi tiết kiệm'
    },
    {
      name: 'IBT',
      code: 'CK liên ngân hàng'
    },
    {
      name: 'PLUS',
      code: 'Nộp thêm tiết kiệm'
    },
    {
      name: 'REDEEM',
      code: 'Tất toán tiết kiệm'
    },
    {
      name: 'BILL',
      code: 'Thanh toán hóa đơn'
    },
    {
      name: 'TOP',
      code: 'Nạp tiền điện thoại'
    },
    {
      name: 'EWL',
      code: 'Nạp ví điện tử'
    },
    {
      name: 'IZI',
      code: 'Nạp tiền vào tkhoan IZI'
    },
    {
      name: 'SYSTEM',
      code: 'Mã lỗi chung, khác của hệ thống'
    }
  ];

  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private excelService: ExcelService
  ) {
  }

  ngOnInit() {
    this.getListData(this.re_search);
  }

  getListData(params) {
    this.listData = [];
    this.isProcessLoad = 1;
    // xu ly
    this.ncbService.searchNotify(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body.content;
        // console.log('==12', this.listType.filter(e => e.name === 'URT')[0]['code']);
        // body.content.forEach(element => {
        //   this.tempType = element.type === null ? element.type : this.listType.filter(e => e.name === element.type)[0]['code'];
        //   this.listData.push({
        //     error: element.error,
        //     mes_En: element.mes_En,
        //     mes_Vn: element.mes_Vn,
        //     msgCode: element.msgCode,
        //     msg_Code_1: element.msg_Code_1,
        //     provider: element.provider,
        //     type: this.tempType
        //   });
        // });
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.listData = [];
      this.totalSearch = 0;
      this.isProcessLoad = 0;
      this.toastr.error('Không lấy được dữ liệu', 'Thất bại');
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
        this.ncbService.deleteNotify({msgCode: code}).then(() => {
          this.listData.splice(index, 1);
          Swal.fire(
            'Đã xoá!',
            'Dữ liệu đã xoá hoàn toàn.',
            'success'
          );
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
    // payload.page = 0;
    if (payload.provider !== '' || payload.type !== '') {
      payload.page = 0;
    } else {
      payload.page = 0;
    }
    this.getListData(payload);
  }
  // keyDownFunction(event) {
  //   if (event.keyCode === 13) {
  //     this.isSearch = false;
  //     this.re_search.cityCode = this.re_search_keyword;
  //     this.getListData(this.re_search);
  //   }
  // }
  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

  getDataExcel(search): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.ncbService.searchNotify(search)
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
    search.size = 1000;
    const page = Math.ceil(this.totalSearch / search.size);
    search.page = 0;
    await this.getDataExcel(search);
    const data = [];
    this.arrExport.forEach((element) => {
      data.push({
        'Nhà cung cấp': element.provider,
        'Kiểu loại': element.type,
        'Mã tin nhắn': element.msgCode,
        'Mã tin nhắn 1': element.msg_Code_1,
        'Tin nhắn Tiếng Việt': element.mes_Vn,
        'Tin nhắn Tiếng Anh': element.mes_En,
        'Lỗi': element.error
      });
    });
    this.excelService.exportAsExcelFile(data, 'list_notify');
    this.isProcessLoadExcel = 0;
    return;
  }

}
