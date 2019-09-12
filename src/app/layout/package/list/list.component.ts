import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'package-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService]
})
export class ListComponent implements OnInit {
  search_keyword: any = '';
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;
  re_search = {
    serviceId: '',
    status: '',
    size: 10,
    page: 0,
    previous_page: 0
  };

  selectProvine: any;
  listData: any = [
    {
      'id': 1,
      'serviceId': 'Service 1',
      'description': 'This is description1',
      'status': 'A'
    },
    {
      'id': 2,
      'serviceId': 'Service 2',
      'description': 'This is description2',
      'status': 'A'
    },
    {
      'id': 3,
      'serviceId': 'Service 3',
      'description': 'This is description3',
      'status': 'A'
    }
  ];
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
      name: 'Inactive',
      code: 'D',
    }
  ];
  protected modalOp: NgbModalRef;

  @ViewChild('modalPackage')
  public modalPackageElementRef: ElementRef;

  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.getListData({});
  }

  getListData(params) {
    this.listData = [];
    this.isProcessLoad = 1;
    // xu ly
    this.ncbService.searchPackage(params).then((result) => {
      console.log('XX===', result.json());
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
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
        this.ncbService.deleteNcbGuide({ id: id }).then(() => {
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
  async openModalPackage() {
    // await this.getItem(id);
    this.openModal(this.modalPackageElementRef, 'modal-package', 'static');
  }
  cancelAction(event) {
    console.log('huy bo thanh con');

  }
  loadPage(page: number) {
    const page_number = page - 1;
    if (this.isSearch === false) {
      if (page_number !== this.re_search.previous_page) {
        this.re_search.page = page_number;
        this.re_search.previous_page = page_number;
        this.getListData(this.re_search);
      }
    } else {
      if (page_number !== this.re_search.previous_page) {
        this.re_search.page = page_number;
        this.re_search.previous_page = page_number;
        this.onSearch(this.re_search);
      }
    }
  }
  onSearch(payload) {
    this.isSearch = true;
    this.listData = [];
    this.isProcessLoad = 1;
    this.ncbService.searchNcbGuide(payload).then(result => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.isProcessLoad = 0;
      this.listData = [];
      this.toastr.error('Vui lòng thử lại', 'Lỗi hệ thống!');
    });
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

}
