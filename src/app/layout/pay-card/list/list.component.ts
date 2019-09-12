import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'pay-card-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService, Helper]
})
export class ListComponent implements OnInit {
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
  listPGD: any = [];
  listBranch: any = [];
  listRole: any = [];
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  re_search: any = {
    fullName: '',
    page: 0,
    size: 10,
    transactionCode: '',
    branchCode: '',
    roleId: '',
    status: '',
    previous_page: 0,
    fromDate: 0,
    toDate: 0
  };

  search: any = {
    page: 0,
    size: 10,
    previous_page: 0
  };
  listData: any = [];
  listPageSize: any = [10, 20, 30, 40, 50];
  search_keyword: any = '';
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
    private helper: Helper
  ) { }

  ngOnInit() {
    this.getListData(this.re_search);
    this.getBranchs();
    this.getListRole();
    this.loadDate();
  }

  getListData(params) {
    this.isProcessLoad = 1;
    // xu ly
    this.listData = [];
    this.ncbService.searchPayCard(params).then((result) => {
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
        this.listData.splice(index, 1);
        const formData = this.helper.urlEncodeParams({ prdCode: code });
        this.ncbService.deletePayCard(formData).then((res) => {
          console.log('--res', res.json());
          Swal.fire(
            'Đã xoá!',
            'Dữ liệu đã xoá hoàn toàn.',
            'success'
          );
        }).catch((err) => {});
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
    if (this.isSearch === false) {
      if (page_number !== this.search.previous_page) {
        this.search.page = page_number;
        this.search.previous_page = page_number;
        this.getListData(this.search);
      }
    } else {
      if (page_number !== this.re_search.previous_page) {
        this.re_search.page = page_number;
        this.re_search.previous_page = page_number;
        this.onSearch(this.re_search);
      }
    }
  }
  changeSize(size: number) {
    this.search.page = 0;

    this.getListData(this.search);

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
    if (this.mRatesDateS_7 !== undefined && this.mRatesDateS !== undefined) {
      this.re_search.toDate = this.tranferDate(this.mRatesDateS_7);
      this.re_search.fromDate = this.tranferDate(this.mRatesDateS);
    }
    this.isSearch = true;
    this.isProcessLoad = 1;
    this.ncbService.searchPayCard(params).then((result) => {
      this.listData = [];
      setTimeout(() => {
        this.isProcessLoad = 0;
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;
      }, 500);
    }).catch((err) => {
      this.isProcessLoad = 0;
      this.listData = [];
      this.toastr.error('Vui lòng thử lại', 'Lỗi hệ thống!');

    });
  }
  exportExcel() {

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

    });
  }
  getPGD() {
    this.listPGD = [];
    this.ncbService.getPGD({brnCode: this.re_search.branchCode}).then((result) => {
      this.listPGD.push({ code: '', name: 'Tất cả' });
      result.json().body.content.forEach(element => {
        this.listPGD.push({
          code: element.departCode,
          name: element.departName,
        });
      });

    }).catch((err) => {

    });
  }

  getListRole() {
    this.listRole = [];
    this.ncbService.searchRoles({
      status: 'A',
      roleName: '',
      page: 1,
      size: 1000
    }).then((result) => {
      this.listRole.push({ code: '', name: 'Tất cả' });
      result.json().body.content.forEach(element => {
        this.listRole.push({
          code: element.roleId,
          name: element.roleName,
        });
      });
    }).catch((err) => {

    });
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
