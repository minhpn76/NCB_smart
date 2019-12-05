import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ExcelService } from '../../../services/excel.service';
import { OrderPipe } from 'ngx-order-pipe';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'feature-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService, ExcelService]
})
export class ListComponent implements OnInit {
  private modalOp: NgbModalRef;

  search: any = {
    keyword: '',
    feature_name: '',
    feature_code: '',
    page: 1,
    page_size: 10,
    total_items: 0,
    previous_page: 0,
    process_load: 0,
    process_export: 0,
    active: 2
  };
  arrDataExport: any = [];
  listProvice: any = [
    {
      name: 'Tất cả',
      code: 0,
    }
  ];
  listDistrict: any = [
    {
      name: 'Vui lòng chọn quận/huyện',
      code: 0,
    }
  ];
  listData: any = [];
  listPageSize: any = [10, 20, 30, 40, 50];
  listStatus: any = [
    {
      name: 'Tất cả',
      code: 2,
    },
    {
      name: 'Active',
      code: 1,
    },
    {
      name: 'Deactive',
      code: 0,
    }
  ];
  order: string = 'name';
  reverse: boolean = false;

  sortedCollection: any[];
  constructor(
    private ncbService: NCBService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private orderPipe: OrderPipe

  ) { 
    this.sortedCollection = orderPipe.transform(this.listData, 'name');
  }

  ngOnInit() {
    this.getListFeature(this.search);

  }
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  getListFeature(params) {
    this.search.process_load = 1;
    // xu ly
    this.listData = [];
    this.listData = [
      { code: 'TEST1', name: 'Chuyển tiền nội bộ', active: 1 },
      { code: 'TEST2', name: 'Chuyển tiền 24/7', active: 1 },
      {code: 'TEST3', name: 'Chuyển tiền LNH', active: 1}


    ];
    this.search.process_load = 0;
    this.search.total_items = this.listData.length;

    // this.ncbService.getListFeature(params).then((result) => {
    //   setTimeout(() => {
    //     this.listData = [
    //       { code: 'TEST1', name: 'Chuyển tiền nội bộ', active: 1 },
    //       { code: 'TEST2', name: 'Chuyển tiền 24/7', active: 1 },
    //       {code: 'TEST3', name: 'Chuyển tiền LNH', active: 1}


    //     ];
    //     this.search.total_items = this.listData.length;
    //     this.search.process_load = 0;
    //   }, 300);

    // }).catch((err) => {

    // };)


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
        this.search.process_load = 1;

        Swal.fire(
          'Đã xoá!',
          'Dữ liệu đã xoá hoàn toàn.',
          'success'
        );
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
    if (page !== this.search.previous_page) {
        this.search.previous_page = page;
        // this.getProduct(this.search);
    }
  }
  onSearch() {
    console.log('search', this.search);
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      console.log('this.search---', this.search.keyword);
        // this.getListProvince(this.search);
    }
  }
  // upload

  // export
  getListDataExcel(search): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      // If active filter Create
      // search.create_from = parseInt((new Date(this.mRatesDate_7.month + '/' + this.mRatesDate_7.day + '/' + this.mRatesDate_7.year).getTime() / 1000).toFixed(0));
      // search.create_to = parseInt((new Date(this.mRatesDate.month + '/' + this.mRatesDate.day + '/' + this.mRatesDate.year).getTime() / 1000).toFixed(0)) + 86400;
      this.ncbService.getListUser(search)
        .then((result) => {
            this.arrDataExport = this.arrDataExport.concat(result.json().body.content);
            resolve();
        })
        .catch((err) => {
            resolve();
        });
    });
    return promise;
  }
  async exportToExcel() {
    this.arrDataExport = [];
    this.search.process_export = 1;
    const search = Object.assign({}, this.search);
    search.page_size = 1000;
    const page = Math.ceil(search.total_items / search.page_size);
    for (let i = 1; i <= (page <= 1 ? 1 : page); i++) {
        search.page = i;
        await this.getListDataExcel(search);
    }

    const data = [];
    this.arrDataExport.forEach((element) => {
      data.push({
        'fullName': element.fullName,
        'email' : element.email,
        'phone' : element.phone,
        'userName' : element.userName,
        'userCode' : element.userCode,
        'roleName' : element.role.roleName

      });
    });

    this.excelService.exportAsExcelFile(data, 'List_Feature_App');
    this.search.process_export = 0;
    return;
}
}
