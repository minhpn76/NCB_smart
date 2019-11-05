import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { Router } from '@angular/router';
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
  listNameProduct: any = [];
  listNamePrdCode: any = [];

  listRole: any = [];
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  imageShow: any = '';
  re_search: any = {
    product: '',
    page: 0,
    size: 10,
    prdcode: '',
    status: '',
    previous_page: 0
  };
  mode: any = '';
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
      code: 'ACTIVE',
    },
    {
      name: 'Deactive',
      code: 'DEACTIVE',
    }
  ];
  // khai bao tham so
  EditRowID1: any = '';
  showEditTable = false;
  indexTempReasonCard: any;
  indexTempOtherCard: any;
  indexTempCreditCard: any;


  parCardConfig: any = {
    creditCardNumber: {
      list: [],
      total: 0,
      isLoad: 0,
      editRow: ''
    },
    reasonCard: {
      list: [],
      total: 0,
      isLoad: 0,
      editRow: ''
    },
    otherConfig: {
      list: [],
      total: 0,
      isLoad: 0,
      editRow: ''
    }
  };
  creditForm: any = {
    value: ''
  };

  reasonForm: any = {
    value: '',
    code: '',
  };
  objEditCredit: any = {
    oldValue: '',
    newValue: ''
  };

  otherForm: any = {
    param: '',
    code: '',
    value: '',
    note: ''
  };
  objOtherConfig: any = {};

  protected modalOp: NgbModalRef;

  @ViewChild('creditCard', { static: false }) creditCardElementRef: ElementRef;
  // public creditCardElementRef: ElementRef;

  @ViewChild('reasonCard', { static: false }) reasonCardElementRef: ElementRef;
  // public reasonCardElementRef: ElementRef;

  @ViewChild('otherConfigCard', { static: false }) otherConfigCardElementRef: ElementRef;
  // public otherConfigCardElementRef: ElementRef;

  @ViewChild('showImage', { static: false }) showImageElementRef: ElementRef;
  // public showImageElementRef: ElementRef;


  @Output() emitCloseModal = new EventEmitter<any>();

  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private helper: Helper,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router,
  ) {

  }


  ngOnInit() {
    this.getListData(this.re_search);
    this.getParamData({
      page: 0,
      size: 1000,
    });
    this.getCreditCardNumber();
    this.getReasonCard();
    this.getOtherConfigCard();
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

  getParamData(params) {
    this.isProcessLoad = 1;
    // xu ly
    this.listData = [];
    this.ncbService.searchPayCard(params).then((result) => {
      const body = result.json().body.content;
      body.forEach(element => {

        this.listNamePrdCode.push(element.prdcode);
        this.listNameProduct.push(element.product);

      });
      this.listNamePrdCode = this.listNamePrdCode.reduce(function (a, b) {
        if (a.indexOf(b) === -1) {
          a.push(b);
        }
        return a;
      }, []);
      this.listNameProduct = this.listNameProduct.reduce(function (a, b) {
        if (a.indexOf(b) === -1) {
          a.push(b);
        }
        return a;
      }, []);
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
        this.ncbService.deletePayCard({ prdCode: code }).then((res) => {
          if (res.json().code === '00') {
            Swal.fire(
              'Đã xoá!',
              'Dữ liệu đã xoá hoàn toàn.',
              'success'
            );
            this.onSearch(this.re_search);
          } else {
            this.toastr.error('Không thể xoá được dữ liệu', 'Thất bại');
          }
        }).catch((err) => { });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Huỷ bỏ',
          'Dữ liệu được bảo toàn :)',
          'error'
        );
      }
    });
  }
  cancelAction() {
    this.router.navigateByUrl('/pay-card');

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
  changeSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);

  }

  onSearch(params) {
    if (params.product !== '' || params.prdcode !== '' || params.status !== '') {
      params.page = 0;
    } else {
      params.page = 0;
    }
    this.getListData(params);
  }
  getCreditCardNumber() {
    // xu ly
    this.parCardConfig.creditCardNumber.list = [];
    this.parCardConfig.creditCardNumber.total = 0;
    this.parCardConfig.creditCardNumber.isLoad = 1;

    this.ncbService.getCreditCardNumber().then((result) => {
      const body = result.json().body;
      this.parCardConfig.creditCardNumber.list = body;
      this.parCardConfig.creditCardNumber.isLoad = 0;
      this.parCardConfig.creditCardNumber.total = body.length;

    }).catch((err) => {
      this.parCardConfig.creditCardNumber.list = [];
      this.parCardConfig.creditCardNumber.total = 0;
      this.parCardConfig.creditCardNumber.isLoad = 0;
      this.toastr.error('Không lấy được dữ liệu', 'Lỗi hệ thống!');
    });
  }

  getReasonCard() {
    // xu ly
    this.parCardConfig.reasonCard.list = [];
    this.parCardConfig.reasonCard.total = 0;
    this.parCardConfig.reasonCard.isLoad = 1;

    this.ncbService.getReissueCardReason().then((result) => {
      const body = result.json().body;
      this.parCardConfig.reasonCard.list = body;
      this.parCardConfig.reasonCard.isLoad = 0;
      this.parCardConfig.reasonCard.total = body.length;

    }).catch((err) => {
      this.parCardConfig.reasonCard.list = [];
      this.parCardConfig.reasonCard.total = 0;
      this.parCardConfig.reasonCard.isLoad = 0;
      this.toastr.error('Không lấy được dữ liệu', 'Lỗi hệ thống!');
    });
  }

  getOtherConfigCard() {
    // xu ly
    this.parCardConfig.otherConfig.list = [];
    this.parCardConfig.otherConfig.total = 0;
    this.parCardConfig.otherConfig.isLoad = 1;

    this.ncbService.getOtherConfig().then((result) => {
      const body = result.json().body;
      this.parCardConfig.otherConfig.list = body;
      this.parCardConfig.otherConfig.isLoad = 0;
      this.parCardConfig.otherConfig.total = body.length;

    }).catch((err) => {
      this.parCardConfig.otherConfig.list = [];
      this.parCardConfig.otherConfig.total = 0;
      this.parCardConfig.otherConfig.isLoad = 0;
      this.toastr.error('Không lấy được dữ liệu', 'Lỗi hệ thống!');
    });
  }


  editDataCreditCard(val, index) {
    this.indexTempCreditCard = index;
    this.parCardConfig.creditCardNumber.editRow = val.code;
    this.objEditCredit.oldValue = val.value;
  }
  cancelCreditCard(val, index) {
    this.indexTempCreditCard = '';
    this.parCardConfig.creditCardNumber.editRow = '';
    this.objEditCredit.oldValue = '';
    this.getCreditCardNumber();
  }
  handledDataCredit(event) {
    this.objEditCredit.newValue = event;
  }
  numericOnly(event): boolean {
    const patt = /^([0-9])$/;
    const result = patt.test(event.key);
    if (result === false) {
      this.toastr.error('Giá trị phải là số', 'Thất bại!');
      return result;
    }
  }

  saveCreditForm(value) {
    this.objEditCredit.newValue = value;
    this.ncbService.editInlineCreditCard(this.objEditCredit).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error('Lỗi hệ thống', 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          this.router.navigateByUrl('/pay-card');
          this.objEditCredit = {
            newValue: '',
            oldValue: '',
          };
          this.parCardConfig.creditCardNumber.editRow = '';
        }
      } else {
        this.toastr.error(result.json().description, 'Thất bại!');
      }
    });
  }

  editOtherConfigCard(val, index) {
    this.parCardConfig.otherConfig.editRow = val.code;
    this.indexTempOtherCard = index;
    this.otherForm = val;
  }
  cancelOtherConfigCard(val, index) {
    this.parCardConfig.otherConfig.editRow = '';
    this.indexTempOtherCard = '';
    this.otherForm = {};
   this.getOtherConfigCard();
  }

  editReasonCard(val, index) {
    this.indexTempReasonCard = index;
    this.parCardConfig.reasonCard.editRow = val.code;
    this.reasonForm = val;
  }

  cancelReasonCard(val, index) {
    this.indexTempReasonCard = '';
    this.parCardConfig.reasonCard.editRow = '';
    this.reasonForm = {};
    this.getReasonCard();
  }

  saveReasonCard() {
    this.ncbService.createReissueCardReason(this.reasonForm).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error('Lỗi hệ thống', 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          this.router.navigateByUrl('/pay-card');
          this.parCardConfig.reasonCard.editRow = '';
        }
      } else {
        this.toastr.error(result.json().description, 'Thất bại!');
      }
    });
  }

  saveOtherConfig() {
    this.ncbService.createOtherConfigCard(this.otherForm).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error('Lỗi hệ thống', 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          this.router.navigateByUrl('/pay-card');
          this.parCardConfig.otherConfig.editRow = '';
        }
      } else {
        this.toastr.error(result.json().description, 'Thất bại!');
      }
    });
  }


  deleteCreditCard(index, val) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.ncbService.deleteCreditCard({ value: val }).then((res) => {
          if (res.json().code === '00') {
            Swal.fire(
              'Đã xoá!',
              'Dữ liệu đã xoá hoàn toàn.',
              'success'
            );
            this.parCardConfig.creditCardNumber.list.splice(index, 1);
            this.router.navigateByUrl('/pay-card');
          } else {
            this.toastr.error('Không thể xoá được dữ liệu', 'Thất bại');
          }
        }).catch((err) => { });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Huỷ bỏ',
          'Dữ liệu được bảo toàn :)',
          'error'
        );
      }
    });
    this.parCardConfig.creditCardNumber.editRow = '';
  }

  deleteReasonCard(index, val, code) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.ncbService.deleteReissueCardReason({
          code: code
        }).then((res) => {
          if (res.json().code === '00') {
            Swal.fire(
              'Đã xoá!',
              'Dữ liệu đã xoá hoàn toàn.',
              'success'
            );
            this.parCardConfig.reasonCard.list.splice(index, 1);
            this.router.navigateByUrl('/pay-card');
          } else {
            this.toastr.error('Không thể xoá được dữ liệu', 'Thất bại');
          }
        }).catch((err) => { });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Huỷ bỏ',
          'Dữ liệu được bảo toàn :)',
          'error'
        );
      }
      this.parCardConfig.reasonCard.editRow = '';
    });
  }

  deleteOtherConfigCard(index, val, code) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.ncbService.deleteOtherConfigCard({
          param: val,
          code: code
        }).then((res) => {
          if (res.json().code === '00') {
            Swal.fire(
              'Đã xoá!',
              'Dữ liệu đã xoá hoàn toàn.',
              'success'
            );
            this.parCardConfig.otherConfig.list.splice(index, 1);
            this.router.navigateByUrl('/pay-card');
          } else {
            this.toastr.error('Không thể xoá được dữ liệu', 'Thất bại');
          }
        }).catch((err) => { });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Huỷ bỏ',
          'Dữ liệu được bảo toàn :)',
          'error'
        );
      }
    });
    this.parCardConfig.otherConfig.editRow = '';
  }

  openModal(content, classLayout = '', type = '') {
    if (type === 'static') {
      this.modalOp = this.modalService.open(content, { keyboard: false, backdrop: 'static', windowClass: classLayout, size: 'lg' });
    } else if (type === 'sm') {
      this.modalOp = this.modalService.open(content, { windowClass: classLayout, size: 'sm' });
    } else {
      this.modalOp = this.modalService.open(content, { windowClass: classLayout, size: 'lg' });
    }
    this.modalOp.result.then((result) => {
    }, (reason) => {
    });
  }
  modalCreditCard() {
    this.openModal(this.creditCardElementRef, 'modal-creditcard', 'static');
  }
  modalReasonCard() {
    this.openModal(this.reasonCardElementRef, 'modal-reasoncard', 'static');
  }
  modalOtherCard() {
    this.openModal(this.otherConfigCardElementRef, 'modal-othercard', 'static');
  }
  async modalShowImage(image) {
    // tslint:disable-next-line:no-unused-expression
    await this.getImageShow(image);
    this.openModal(this.showImageElementRef, 'modal-showimage', 'sm');
  }
  getImageShow(image) {
    this.imageShow = image;
  }
  closeModal() {
    this.modalOp.close();
  }

  onSubmitCredit(event) {
    if (event === 1) {
      if (this.creditForm.value === '') {
        this.toastr.error('Giá trị không được để trống', 'Thât bại');
        return;
      }
      this.ncbService.checkDuplicateCreditNumber({ value: this.creditForm.value }).then((result) => {
        if (result.status === 200) {
          if (result.json().code !== '00') {
            this.toastr.error('Lỗi hệ thống', 'Thất bại!');
          } else {
            const body = result.json().body;
            if (body === true) {
              Swal.fire({
                title: 'Dữ liệu đã tồn tại',
                text: 'Bạn có muốn ghi đè không?',
                type: 'warning',
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Huỷ',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                  this.closeModal();
                } else {
                  this.createCreditCard();
                }
              }, function (dismiss) {
                this.closeModal();
              });
            } else {
              this.createCreditCard();
            }
          }
        } else {
          this.toastr.error(result.json().description, 'Thất bại!');
        }
      }).catch(err => {

      });
    } else if (event === 2) {
      if (this.reasonForm.value === '' || this.reasonForm.code === '') {
        this.toastr.error('Các trường giá trị không được để trống', 'Thât bại');
        return;
      }
      this.ncbService.checkDuplicateReissueCardReason({ code: this.reasonForm.code }).then((result) => {
        if (result.status === 200) {
          if (result.json().code !== '00') {
            this.toastr.error('Lỗi hệ thống', 'Thất bại!');
          } else {
            const body = result.json().body;
            if (body === true) {
              Swal.fire({
                title: 'Dữ liệu đã tồn tại',
                text: 'Bạn có muốn ghi đè không?',
                type: 'warning',
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Huỷ',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                  this.closeModal();
                } else {
                  this.createReasonCard();
                }
              }, function (dismiss) {
                this.closeModal();
              });
            } else {
              this.createReasonCard();
            }
          }
        } else {
          this.toastr.error(result.json().description, 'Thất bại!');
        }
      }).catch(err => {

      });
    } else {
      if (this.otherForm.value === '' || this.otherForm.code === '' || this.otherForm.param === '' || this.otherForm.note === '') {
        this.toastr.error('Các trường giá trị không được để trống', 'Thât bại');
        return;
      }
      this.ncbService.checkDuplicateOtherConfigCard({
        param: this.otherForm.param,
        code: this.otherForm.code
      }).then((result) => {
        if (result.status === 200) {
          if (result.json().code !== '00') {
            this.toastr.error('Lỗi hệ thống', 'Thất bại!');
          } else {
            const body = result.json().body;
            if (body === true) {
              Swal.fire({
                title: 'Dữ liệu đã tồn tại',
                text: 'Bạn có muốn ghi đè không?',
                type: 'warning',
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Huỷ',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                  this.closeModal();
                } else {
                  this.createOtherConfigCard();
                }
              }, function (dismiss) {
                this.closeModal();
              });
            } else {
              this.createOtherConfigCard();
            }
          }
        } else {
          this.toastr.error(result.json().description, 'Thất bại!');
        }
      }).catch(err => {
        this.toastr.error('Lỗi hệ thống', 'Thất bại!');
      });
      this.router.navigateByUrl('/pay-card');
      // this.parCardConfig.otherConfig.editRow = '';
    }

  }

  createCreditCard() {
    this.ncbService.createCreditNumber({
      value: this.creditForm.value
    }).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error('Lỗi hệ thống', 'Thất bại!');
        } else {
          this.toastr.success('Thêm mới thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/pay-card');
          }, 500);
          this.closeModal();
          this.getCreditCardNumber();
          this.creditForm = {};
        }
      } else {
        this.toastr.error(result.json().description, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().description, 'Thất bại!');
    });
  }

  createReasonCard() {
    this.ncbService.createReissueCardReason({
      value: this.reasonForm.value,
      code: this.reasonForm.code,

    }).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error('Lỗi hệ thống', 'Thất bại!');
        } else {
          this.toastr.success('Thêm mới thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/pay-card');
          }, 500);
          this.closeModal();
          this.getReasonCard();
          this.reasonForm = {};
        }
      } else {
        this.toastr.error(result.json().description, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().description, 'Thất bại!');
    });
  }
  createOtherConfigCard() {
    this.ncbService.createOtherConfigCard({
      value: this.otherForm.value,
      code: this.otherForm.code,
      param: this.otherForm.param,
      note: this.otherForm.note
    }).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error('Lỗi hệ thống', 'Thất bại!');
        } else {
          this.toastr.success('Thêm mới thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/pay-card');
          }, 500);
          this.closeModal();
          this.getOtherConfigCard();
          this.otherForm = {};
        }
      } else {
        this.toastr.error(result.json().description, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().description, 'Thất bại!');
    });
  }
}
