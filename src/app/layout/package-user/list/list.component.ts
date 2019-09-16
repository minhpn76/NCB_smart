import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'package-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService]
})
export class ListComponent implements OnInit {
  search_keyword: any = '';
  listPGD: any = [];
  listBranch: any = [];
  listRole: any = [];
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  re_search: any = {
    brncode: '',
    usrfname: '',
    officecode: '',
    cifname: '',
    usrstatus: '',
    page: 0,
    size: 10,
    previous_page: 0,
    filter: ''
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
  ) { }

  ngOnInit() {
    this.getListData(this.re_search);
    this.getBranchs();
    this.getAllPGD();
  }

  getListData(params) {
    this.isProcessLoad = 1;
    // xu ly
    this.listData = [];
    this.ncbService.searchPackageUser(params).then((result) => {
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

  deleteItem(event, index) {
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
        Swal.fire(
          'Đã xoá!',
          'Dữ liệu đã xoá hoàn toàn.',
          'success'
        );

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
  changeSize(size: number) {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

  onSearch(params) {
    // date
    // if (params.brncode !== '' || params.usrfname !== '' || params.officecode !== '' || params.cifname !== '' || params.usrstatus !== '' || params.status !== '') {
    params.page = 0;
    // }
    this.getListData(params);
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
      this.toastr.error('Không lấy được dữ liệu chi nhánh', 'Thất bại');
    });
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
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.isSearch = false;
      this.re_search.filter = this.search_keyword;
      this.getListData(this.re_search);
    }
  }
}
