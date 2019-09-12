import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'user-profile-list',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [NCBService]
})
export class UserProfileComponent implements OnInit {
  listPGD: any = [];
  listBranch: any = [];
  listRole: any = [];
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  search_keyword: any = '';
  re_search: any = {
    cifgrp: '',
    usrid: '',
    idno: '',
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
      name: 'Inactive',
      code: 'D',
    }
  ];
  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getListData(this.re_search);
  }

  getListData(params) {
    this.isProcessLoad = 1;
    // xu ly
    this.listData = [];
    this.ncbService.searchProfileUser(params).then((result) => {
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
  changeSize(size: number) {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

  onSearch(params) {
    // date
    this.isSearch = true;
    this.isProcessLoad = 1;
    this.ncbService.searchProfileUser(params).then((result) => {
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
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.isSearch = false;
      this.re_search.filter = this.search_keyword;
      this.getListData(this.re_search);
    }
  }
  changePageSize() {
    this.re_search.page = 0;
    this.isSearch = false;
    this.getListData(this.re_search);
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


}
