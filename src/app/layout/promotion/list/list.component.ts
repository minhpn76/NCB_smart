import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ExcelService } from '../../../services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'promotion-list',
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
  re_search = {
    proCode: '',
    proName: '',
    status: '',
    size: 10,
    page: 0,
    previous_page: 0
  };
  passData: any = {};
  listPrdName: any = [];

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
  protected modalOp: NgbModalRef;

  @ViewChild('modalPackage', { static: false }) modalPackageElementRef: ElementRef;
  // public modalPackageElementRef: ElementRef;

  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private modalService: NgbModal,
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
    this.ncbService.searchPromotion(params).then((result) => {
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
  keyDownFunction(event) {
    if (event.keyCode === 13) {
        this.onSearch(this.re_search);
    }
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
        this.ncbService.deletePromotion({ proCode: id }).then((res) => {
          if (res.json().code === '00') {
            Swal.fire(
              'Đã xoá!',
              'Dữ liệu đã xoá hoàn toàn.',
              'success'
            );
            this.onSearch(this.re_search);
          } else {
            this.toastr.error('Xoá dự liệu thất bại!', 'Thất bại');
          }

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
    this.passData = data;
    // await this.getItem(id);
    this.openModal(this.modalPackageElementRef, 'modal-package', 'static');
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
    if (payload.proCode !== '' || payload.status !== '' || payload.proName !== '') {
      payload.page = 0;
    } else {
      payload.page = 0;
    }
    this.getListData(payload);
  }
  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

  getDataExcel(search): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.ncbService.searchPromotion(search)
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
    for (let i = 0; i <= (page <= 0 ? 0 : page); i++) {
        search.page = i;
        await this.getDataExcel(search);
    }
    search.page = 0;
    // const page = Math.ceil(this.totalSearch / search.size);
    // console.log('==page', page);
    // for (let i = 0; i <= (page <= 0 ? 1 : page); i++) {
    //     search.page = i;
    //     const result = await this.getDataExcel(search);
    // }
    const data = [];
    this.arrExport.forEach((element) => {
      data.push({
        'Mã gói khuyến mại': element.proCode,
        'Tên gói khuyến mại': element.proName,
        'Nội dung chương trình': element.proDes,
        'Ngày bắt đầu': element.fromDate,
        'Ngày kết thúc': element.toDate,
        'Trạng thái': element.status === 'A' ? 'Active' : 'Deactive',
        'Người tạo': element.createdBy,
        'Ngày tạo': element.createdDate
      });
    });
    this.excelService.exportAsExcelFile(data, 'list_promotion');
    this.isProcessLoadExcel = 0;
    return;
  }
}
