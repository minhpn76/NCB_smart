import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  passData: any = {};
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
      name: 'Deactive',
      code: 'D',
    }
  ];
  protected modalOp: NgbModalRef;

  @ViewChild('modalUser')
  public modalUserElementRef: ElementRef;
  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private modalService: NgbModal
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
    params.page = 0;
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
    // await this.getItem(id);
    this.openModal(this.modalUserElementRef, 'modal-package', 'static');
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
}
