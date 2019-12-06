import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';
import { ExcelService } from '../../../services/excel.service';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService, ExcelService]
})
export class ListComponent implements OnInit {
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  search_keyword: any = '';
  my_7: any = new Date();
  listPGD: any = [];
  listBranch: any = [];
  listRole: any = [];
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  isProcessLoadExcel: any = 0;
  arrExport: any = [];
  re_search: any = {
    fullName: '',
    page: 0,
    size: 10,
    transactionCode: '',
    branchCode: '',
    userName: '',
    roleName: '',
    previous_page: 0
    // fromDate: 0,
    // toDate: 0
  };
  listData: any = [];
  listPageSize: any = ['10', '20', '30', '40', '50'];
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
  order = 'userName';
  reverse = false;

  sortedCollection: any[];
  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private excelService: ExcelService,
    private orderPipe: OrderPipe
  ) {
    this.sortedCollection = orderPipe.transform(this.listData, 'userName');
  }

  ngOnInit() {
    // this.loadDate();
    this.getListData(this.re_search);
    this.getBranchs();
    this.getAllPGD();
    this.getListRole();
  }
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  getListData(params) {
    this.isProcessLoad = 1;
    // xu ly
    this.listData = [];
    // if (this.mRatesDateS_7 !== undefined && this.mRatesDateS !== undefined) {
    //   params.toDate = this.tranferDate(this.mRatesDateS_7);
    //   params.fromDate = this.tranferDate(this.mRatesDateS);
    // }
    this.ncbService.searchUser(params).then((result) => {
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
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });

  }

  deleteItem(event, index, id) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.ncbService.deleteUser(id).then((res) => {
          if (res.json().code === '00') {
            Swal.fire(
              'Đã xoá!',
              'Dữ liệu đã xoá hoàn toàn.',
              'success'
            );
            this.onSearch(this.re_search);
          } else {
            this.toastr.error('Xoá dữ liệu thất bại', 'Thất bại');
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
  cancelAction(event) {
    console.log('huy bo thanh con');

  }

  loadPage(page: any) {
    const page_number = page - 1;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.getListData(this.re_search);
      this.re_search.page = page;
    }
  }
  changeSize(size) {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }
  tranferDate(params) {
    return params.year + '/' + params.month + '/' + params.day;
  }
  public loadDate(): void {
    this.my_7.setDate(this.my_7.getDate() - 7);
    this.mRatesDateS = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
    this.mRatesDateS_7 = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
  }
  onSearch(params) {
    // date
    if (params.userName !== '' || params.fullName !== '' || params.transactionCode !== '' || params.branchCode !== '' || params.status !== '') {
      params.page = 0;
    } else {
      params.page = 0;
    }
    this.getListData(params);
  }
  getDataExcel(search): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.ncbService.searchUser(search)
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
    // if (this.mRatesDateS_7 !== undefined && this.mRatesDateS !== undefined) {
    //   search.toDate = this.tranferDate(this.mRatesDateS_7);
    //   search.fromDate = this.tranferDate(this.mRatesDateS);
    // }
    const page = Math.ceil(this.totalSearch / search.size);
    for (let i = 0; i <= (page <= 0 ? 0 : page); i++) {
        search.page = i;
        await this.getDataExcel(search);
    }
    search.page = 0;
    // await this.getDataExcel(search);
    const data = [];
    this.arrExport.forEach((element) => {
      data.push({
        'Tên đăng nhập': element.userName,
        'Mã nhân viên': element.userCode,
        'Họ và tên': element.fullName,
        'Email': element.email,
        'Số điện thoại': element.phone,
        'Chi nhánh': element.branchCode,
        'Phòng giao dịch': element.transactionCode,
        'Người tạo': element.updatedBy,
        'Ngày tạo': element.createdDate,
        'Phân quyền': element.role.roleName,
        'Trạng thái': 'Active' ? element.status === 'A' : 'Deactive'
      });
    });

    this.excelService.exportAsExcelFile(data, 'list_user');
    this.isProcessLoadExcel = 0;
    return;
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onSearch(this.re_search);
    }
  }
  onChangeRole() {
    this.onSearch(this.re_search);
  }

  getBranchs() {
    this.listBranch = [];
    this.ncbService.getBranchs().then((result) => {
      this.listBranch.push({ code: '', name: 'Tất cả' });

      result.json().body.forEach(element => {
        this.listBranch.push({
          code: element.brnCode,
          name: element.branchName,
        });
      });

    }).catch((err) => {
      this.toastr.error('Không lấy được dữ liệu chi nhánh', 'Thất bại');
    });
  }
  getListRole() {
    this.listData = [];
    this.isProcessLoad = 1;
    // xu ly
    this.ncbService.searchRoles({
        roleName: '',
        status: '',
        size: 500,
        page: 1,
        previous_page: 0
    }).then((result) => {
      const body = result.json().body;
      this.listRole.push({
        name: 'Tất cả',
        code: ''
      });
      body.content.forEach(element => {
        this.listRole.push({
          name: element.roleName,
          code: element.roleName
        });
      });
    }).catch(err => {
      this.listRole = [];
      this.toastr.error('Không lấy được dữ liệu danh sách phân quyền', 'Lỗi hệ thống!');
    });
  }
  async onChangePGD(value) {
    if (value === '') {
      await this.getAllPGD();
    } else {
      await this.getPGD(value);
    }
  }
  getPGD(value) {
    this.listPGD = [];
    this.ncbService.getPGD({brnCode: value}).then((result) => {
      this.listPGD.push({ code: '', name: 'Tất cả' });
      result.json().body.content.forEach(element => {
        this.listPGD.push({
          code: element.departCode,
          name: element.departName,
        });
      });

    }).catch((err) => {
      this.toastr.error('Không lấy được dữ liệu phòng giao dịch', 'Thất bại');
    });
  }
  getAllPGD() {
    this.listPGD = [];
    this.ncbService.getListPGD().then((result) => {
      this.listPGD.push({ code: '', name: 'Tất cả' });
      result.json().body.forEach(element => {
        this.listPGD.push({
          code: element.departCode,
          name: element.departName,
        });
      });
    }).catch((err) => {
      this.toastr.error('Không lấy được dữ liệu phòng giao dịch', 'Thất bại');
    });
  }
}
