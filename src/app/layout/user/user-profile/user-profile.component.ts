import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ExcelService } from '../../../services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'user-profile-list',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [NCBService, ExcelService]
})
export class UserProfileComponent implements OnInit {
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my_7: any = new Date();
  my: any = new Date();
  listPGD: any = [];
  listBranch: any = [];
  listRole: any = [];
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  search_keyword: any = '';
  isProcessLoadExcel: any = 0;
  passData: any = {};
  re_search: any = {
    cifgrp: '',
    usrid: '',
    idno: '',
    page: 0,
    size: 10,
    // fromDate: 0,
    // toDate: 0,
    previous_page: 0
  };
  listData: any = [];
  arrExport: any = [];
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
  protected modalOp: NgbModalRef;

  @ViewChild('modalUser', { static: false }) modalUserElementRef: ElementRef;
  // public modalUserElementRef: ElementRef;
  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    // this.loadDate();
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

  getListData(params) {
    this.isProcessLoad = 1;
    // xu ly
    this.listData = [];
    // if (this.mRatesDateS_7 !== undefined && this.mRatesDateS !== undefined) {
    //   params.toDate = this.tranferDate(this.mRatesDateS_7);
    //   params.fromDate = this.tranferDate(this.mRatesDateS);
    // }
    this.ncbService.searchProfileUser(params).then((result) => {
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

  loadPage(page: any) {
    const page_number = page - 1;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.getListData(this.re_search);
      this.re_search.page = page;
    }
  }
  changeSize(size: number) {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

  onSearch(params) {
    // date
    if (params.cifgrp !== '' || params.usrid !== '' || params.idno !== '') {
      params.page = 0;
    } else {
      params.page = 0;
    }
    this.getListData(params);

  }
  openModal(content, classLayout = '', type = '') {
    if (type === 'static') {
      this.modalOp = this.modalService.open(content, { keyboard: false, backdrop: 'static', windowClass: classLayout, size: 'lg' });
    } else {
        this.modalOp = this.modalService.open(content, { windowClass: classLayout, size: 'lg' });
    }
    this.modalOp.result.then((result) => {
    }, (reason) => {
    });
  }
  async openModalUser(data) {
    this.passData = data;
    if (this.passData.function === null) {
      this.toastr.error('Dữ liệu gói sản phẩm và chương trình khuyến mãi đang là rỗng', 'Thất bại');
      return;
    }
    this.openModal(this.modalUserElementRef, 'modal-package', 'static');
  }
  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }
  // excel
  getDataExcel(search): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.ncbService.searchProfileUser(search)
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
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onSearch(this.re_search);
    }
  }
  async exportExcel() {
    this.arrExport = [];
    this.isProcessLoadExcel = 1;
    const search = Object.assign({}, this.re_search);
    if (this.totalSearch > 1000) {
      this.toastr.error('Dữ liệu quá lớn không thể xuất được dữ liệu', 'Thất bại');
      this.isProcessLoadExcel = 0;
    } else {
      // search.size = 1000;
      // const page = Math.ceil(this.totalSearch / search.size);
      // search.page = 0;
      // await this.getDataExcel(search);
      const page = Math.ceil(this.totalSearch / search.size);
      for (let i = 0; i <= (page <= 0 ? 0 : page); i++) {
          search.page = i;
          await this.getDataExcel(search);
      }
      search.page = 0;
      const data = [];
      this.arrExport.forEach((element) => {
        data.push({
          'CIF': element.cifgrp,
          'Tên đăng nhập': element.usrid,
          'Họ và tên': element.usrfname,
          'CMND/HC': element.datCfmast ? element.datCfmast.idno : '',
          'Nhóm khách hàng': element.crtusrid,
          'Mã gói sản phẩm': element.lm4rm !== null ? element.lm4rm : '',
          'Gói sản phẩm': element.function !== null ? element.function.prdName : '',
          'Ưu đãi': element.function !== null ? element.function.promotionName : '',
          'Tên CT ưu đãi': element.function !== null ? element.function.prodName : ''
        });
      });
      this.excelService.exportAsExcelFile(data, 'list_user');
      this.isProcessLoadExcel = 0;
      return;
    }
  }
}
