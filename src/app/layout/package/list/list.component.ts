import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../../services/excel.service';
import { Helper } from '../../../helper';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'package-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService, ExcelService, Helper]
})
export class ListComponent implements OnInit {
  search_keyword: any = '';
  userInfo: any = [];
  arrExport: any = [];
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
  dataForm: FormGroup;
  submitted = false;
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;
  re_search = {
    prd: '',
    tranType: '',
    typeId: '',
    status: '',
    size: 10,
    page: 0,
    previous_page: 0
  };

  listTranType: any = [
    {
      code: '',
      name: 'Tất cả'
    },
    {
      code: 'CK',
      name: 'Chuyển khoản'
    },
    {
      code: 'TK',
      name: 'Tiết kiệm'
    },
    {
      code: 'TT',
      name: 'Thanh toán'
    },
    {
      code: 'TOPUP',
      name: 'Nạp tiền'
    },
    {
      code: 'QLTK',
      name: 'Phí thường niên',

    }
  ];

  listTypeId: any = [
    {
      code: '',
      name: 'Tất cả'
    },
    {
      code: 'IBT',
      name: 'Chuyển khoản LNH'
    },
    {
      code: 'URT',
      name: 'Chuyển khoản nội bộ'
    },
    {
      code: 'ISL',
      name: 'CK 247'
    },
    {
      code: 'OW6',
      name: 'Chuyển tiền vãng lai'
    },
    {
      code: 'BILL',
      name: 'Thanh toán hóa đơn'
    },
    {
      code: 'TOP',
      name: 'Nạp tiền điện thoại'
    },
    {
      code: 'EWL',
      name: 'Nạp ví điện tử'
    },
    {
      code: 'IZI',
      name: 'Nạp tiền vào TK IZI'
    }
  ];
  listStatus: any = [
    {
      code: '',
      name: 'Tất cả'
    },
    {
      code: 'A',
      name: 'Active'
    },
    {
      code: 'D',
      name: 'Deactive'
    }
  ];
  isProcessLoadExcel: any = 0;
  selectProvine: any;
  listData: any = [];
  listProvinceName: any = [];
  listPageSize: any = [10, 20, 30, 40, 50];

  protected modalOp: NgbModalRef;

  @ViewChild('modalPackage')
  public modalPackageElementRef: ElementRef;

  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private excelService: ExcelService,
    public helper: Helper
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
  }

  ngOnInit() {
    this.getListData(this.re_search);
    this.dataForm = this.formBuilder.group({
      prdName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      tranType: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      typeId: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      quantity: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      customerType: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      ccy: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      limitDaily: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      min: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      max: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      limitFaceid: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      limitFinger: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      promotion: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      promotionName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      percentage: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      fromDate: ['', this.mRatesDateS],
      toDate: ['', this.mRatesDateS_7],
      prd: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      createBy: [JSON.stringify(this.userInfo.userId)],
      status : ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
    });
  }
  get Form() { return this.dataForm.controls; }

  tranferDate(params) {
    return params.year + '/' + params.month + '/' + params.day;
  }

  public loadDate(): void {
    this.my_7.setDate(this.my_7.getDate() - 7);
    this.mRatesDateS = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
    this.mRatesDateS_7 = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
  }

  getListData(params) {
    this.listData = [];
    this.isProcessLoad = 1;
    // xu ly
    this.ncbService.searchPackage(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.listData = [];
      this.totalSearch = 0;
      this.isProcessLoad = 0;
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
        this.ncbService.deletePackage({ prd: code }).then(() => {
          this.listData.splice(index, 1);
          Swal.fire(
            'Đã xoá!',
            'Dữ liệu đã xoá hoàn toàn.',
            'success'
          );
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
  async openModalPackage(data) {
    await this.getPassData(data);
    this.openModal(this.modalPackageElementRef, 'modal-package', 'static');
  }
  getPassData(data) {
    this.dataForm.patchValue({
      prd: data.prd,
      prdName: data.prdName
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
  onSearch(payload) {
    if (payload.prd !== '' || payload.tranType !== '' || payload.typeId !== '' || payload.status !== '' ) {
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
    this.isSearch = false;
    this.getListData(this.re_search);
  }

  // excel
  getDataExcel(search): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.ncbService.searchPackage(search)
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
    // for (let i = 0; i <= (page <= 0 ? 0 : page); i++) {
    //     search.page = i;
    //     await this.getDataExcel(search);
    // }
    search.page = 0;
    await this.getDataExcel(search);
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
        'Phân quyền': element.role.roleName
      });
    });

    this.excelService.exportAsExcelFile(data, 'list_package');
    this.isProcessLoadExcel = 0;
    return;
  }

}
