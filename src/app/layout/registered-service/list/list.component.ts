import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'register-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService]
})
export class ListComponent implements OnInit {
  keyword: any = '';
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;
  listBranch: any = [];
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
  isSearchItem = 0;
  re_search = {
    compCode: '',
    idCard: '',
    type: '0',
    service: '',
    status: '',
    size: 10,
    page: 1,
    previous_page: 0,
    fromDate: '',
    toDate: ''
  };
  comment: any = '';
  requestCode: '';
  obj_request: any = {};
  passData: any = {};
  req_search = {
    compCode: '',
    compName: '',
    status: '',
    comment: '',
    userId: ''
  };
  listType: any = [
    {
      code: 1,
      name: 'CARD'
    },
    {
      code: 2,
      name: 'ACCOUNT'
    }
  ];
  listService: any = [];
  listLog: any = [];

  selectProvine: any;
  listData: any = [];
  listProvinceName: any = [];
  listPageSize: any = [10, 20, 30, 40, 50];
  listPHe: any = [
    {
      name: 'All',
      code: 0
    }, {
      name: 'Card',
      code: 2
    }
  ];
  listStatus: any = [
    {
      name: 'NEW',
      code: 1,
    },
    {
      name: 'PROCESSING',
      code: 2,
    },
    {
      name: 'CLOSED',
      code: 3,
    }
  ];
  infoUser: any = {};
  protected modalOp: NgbModalRef;

  @ViewChild('popupReqest')
  public popupReqestElementRef: ElementRef;

  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.infoUser = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : {};
    this.loadDate();
    this.getListData(this.re_search);
    this.getBranchs();
    this.getListService();
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
  getListData(params) {
    this.listData = [];
    this.isProcessLoad = 1;
    if (this.mRatesDateS_7 !== undefined && this.mRatesDateS !== undefined) {
      params.toDate = this.tranferDate(this.mRatesDateS_7);
      params.fromDate = this.tranferDate(this.mRatesDateS);
    }
    // xu ly

    this.ncbService.searchRegisterService(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.total;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.isProcessLoad = 0;
      this.listData = [];
      this.totalSearch = 0;
    });
  }
  public loadDate(): void {
    this.my_7.setDate(this.my_7.getDate() - 7);
    this.mRatesDateS = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
    this.mRatesDateS_7 = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
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
        this.ncbService.deleteNcbQA({ id: id }).then(() => {
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
  cancelAction(event) {
    console.log('huy bo thanh con');

  }
  loadPage(page: number) {
    const page_number = page;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.onSearch(this.re_search);
    }
  }
  tranferDate(params) {
    return params.year + '/' + params.month + '/' + params.day;
  }
  onSearch(payload) {
    this.getListData(payload);
  }
  // keyDownFunction(event) {
  //   if (event.keyCode === 13) {
  //     this.isSearch = false;
  //     this.re_search.cityCode = this.re_search_keyword;
  //     this.getListData(this.re_search);
  //   }
  // }
    changeSize(size) {
    this.getListData(this.re_search);
  }
  async openPopUpRequest(id, data) {
    this.passData = {};
    await this.getItem(id);
    this.passData = data;
    this.openModal(this.popupReqestElementRef, 'popup-request', 'static');
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
  keyDownFunction(event, id) {
    if (event.keyCode === 13) {
      this.getItem(id);
    }
  }
  getItem(params): Promise<any> {
    this.isSearchItem = 1;
    this.obj_request = {};
    const promise = new Promise((resolve, reject) => {
      this.ncbService.detailRegisterService(params).then((result) => {
        setTimeout(() => {
          const body = result.json().body.content;
          if (Object.keys(body).length === 0) {
            this.toastr.error('Không tìm thấy kết quả', 'Thất bại');
            return;
          }
          this.obj_request = body;
          this.listLog = body.log;
          this.isSearchItem = 0;
          resolve();
        }, 1000);
      }).catch(err => {
        resolve();
      });
    });
    return promise;
  }
  updateService() {
    if (this.comment === '') {
      this.toastr.error('Không được để trống comment', 'Thất bại');
      return;
    }
    const compName = this.listBranch.filter(item => item.code === this.passData.compCode);
    const payload = {
      compCode: this.passData.compCode,
      compName: compName[0].name,
      status: this.passData.status,
      comment: this.comment,
      userId: this.infoUser.userName
    };
    this.ncbService.updateRegisterService(this.passData.id, payload).then((result) => {
      if (result.json().code === '00') {
        this.toastr.success('Cập nhật log thành công!', 'Thành công');
      } else {
        this.toastr.error(`Vui lòng thử lại ${result.json().description}', 'Thất bại`);
      }
      setTimeout(() => {
        this.getItem(this.passData.id);
        this.comment = '';
      }, 500);
    }).catch((err) => {
      this.toastr.error('Vui lòng thử lại', 'Thất bại');
    });
  }
  getListService() {
    this.listService = [];
    this.ncbService.getListServiceRegister().then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listService = body;
      }, 300);
    }).catch(err => {
      this.toastr.error('Không lấy được dữ liệu dịch vụ', 'Thất bại!');
    });
  }

}
