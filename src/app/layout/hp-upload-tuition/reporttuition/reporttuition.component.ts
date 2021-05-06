import { element } from 'protractor';
import { Helper } from './../../../helper';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';
import { NCBService } from '../../../services/ncb.service';
import Swal from 'sweetalert2';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
@Component({
  selector: 'app-reporttuition',
  templateUrl: './reporttuition.component.html',
  styleUrls: ['./reporttuition.component.scss'],
  providers: [NCBService, Helper, ExcelService]
})
export class ReporttuitionComponent implements OnInit {
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
  my_14: any = new Date();
  listSchool: any;
  listBatch: any;
  re_search = {
    schoolCode: '',
    startDate: '',
    studentCode: '',
    batchCode: '',
    endDate: '',
    status: -1,
    size: 10,
    page: 0,
    previous_page: 0
  };
  listStatus: any = [
    {
      name: 'Đã đóng',
      code: '1',
    },
    {
      name: 'Chưa đóng',
      code: '0',
    },
    {
      name: 'Đang xử lý',
      code: '2',
    }
  ];
  listPageSize: any = [10, 20, 30, 40, 50];
  search_keyword: any = '';
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;
  listData: any[];
  isProcessLoadExcel: any = 0;
  arrExport: any[];

  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    public helper: Helper,
    private router: Router,
    private excelService: ExcelService
  ) {
    localStorage.setItem('redirect', 'false');
    this.loadDate();
  }
  ngOnInit() {
      this.getSchools();
      this.getBatchs();
      this.getListData(this.re_search);
  }
  loadPage(page: number)  {
    const page_number = page;
      this.re_search.page = page_number;
      this.getListData(this.re_search);

  }
  public loadDate(): void {
    this.my_7.setDate(this.my_7.getDate() - 7);
    this.my_14.setDate(this.my.getDate() + 7);
    this.mRatesDateS = {
        year: this.my_7.getFullYear(),
        month: this.my_7.getMonth() + 1,
        day: this.my_7.getDate(),
    };
    this.mRatesDateS_7 = {
        year: this.my_14.getFullYear(),
        month: this.my_14.getMonth() + 1,
        day: this.my_14.getDate(),
    };
    this.re_search.startDate = this.helper.tranferDate(this.mRatesDateS);
    this.re_search.endDate = this.helper.tranferDate(this.mRatesDateS_7);
  }
  getSchools() {
    this.listSchool = [];
    this.listSchool.push({ schoolName: '--Chưa chọn---', schoolCode: ''});
    this.ncbService.getListHpSchool(null).then((result) => {
      const body = result.json().body.content;
      body.forEach(element => {
        this.listSchool.push({
          schoolName: ' - ' + element.schoolName,
          schoolCode: element.schoolCode
        });
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  getBatchs() {
    this.listBatch = [];
    this.listBatch.push({ batchCode: '---Tất cả---'});
    this.ncbService.getlistHpBatch(null).then((result) => {
      const body = result.json().body.content;
      this.re_search.batchCode = body[0].batchCode.toString();
      body.forEach(element => {
        this.listBatch.push({
          batchCode: element.batchCode.toString()
        });
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  /*Câ[j nhat lại ham sert tai day] */
  onSearch(payload) {

     if (payload.batchCode === '---Tất cả---') {payload.batchCode = ''; }

    this.listData = [];
    this.isProcessLoad = 1;
    payload.startDate = this.helper.tranferDate(this.mRatesDateS);
    payload.endDate = this.helper.tranferDate(this.mRatesDateS_7);
    this.ncbService.getListHpTuition(payload).then(result => {
      setTimeout(() => {
        const body = result.json().body;
        if (body === null) {
          return;
        }
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.listData = [];
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
  /*Đổi tên hàm serach trong NCB service */
  getListData(params) {
    this.listData = [];
    this.isProcessLoad = 1;
    if (params.batchCode === '---Tất cả---') {params.batchCode = ''; }
    // xu ly
    this.ncbService.getListHpTuition(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        if (body === null) { return; }
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
        console.log(this.listData);
      }, 300);
    }).catch(err => {
      this.isProcessLoad = 0;
      this.listData = [];
      this.totalSearch = 0;
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
   formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);

  }

  getDataExcel(params): Promise<any> {
    if (params.batchCode = 'Tất cả') {params.batchCode = ''; }
    const promise = new Promise((resolve, reject) => {
      this.ncbService.getListHpTuition(params).then((result) => {
        setTimeout(() => {
          this.arrExport = this.arrExport.concat(result.json().body.content);
              resolve();
        }, 300);
      }).catch(err => {
        resolve();
      });
    });
    return promise;
  }
  async exportDataHocPhi() {
    this.arrExport = [];
    this.isProcessLoadExcel = 1;
    const search = Object.assign({}, this.re_search);
    search.size = this.totalSearch;

    const page = Math.ceil(this.totalSearch / search.size);

    for (let i = 1; i <= (page <= 0 ? 0 : page); i++) {
        search.page = i;
        await this.getDataExcel(search);
    }
    search.page = 0;
    console.log(this.arrExport);
    const data = [];
    // tslint:disable-next-line:no-shadowed-variable
    this.arrExport.forEach((elements) => {
      data.push({
        'Mã Trường': elements.schoolCode ,
        'Tên Trường': elements.schoolName ,
        'Mã khoa': elements.facultyCode,
        'Tên khoa': elements.facultyName,
        'Mã lớp': elements.classCode,
        'Tên lớp': elements.className,
        'Mã học sinh': elements.studentCode,
        'Tên học sinh': elements.studentName,
        'Kỳ thanh toán': elements.term,
        'Mã Phí': elements.costCode,
        'Số tiền': elements.amount,
        'Ngày đóng': elements.paymentDate,
        'Người đóng': elements.paymentBy,
        'Trạng Thái': elements.status === 0 ? 'Chưa đóng' : (elements.status === 1 ? 'Đã đóng' : 'Đang xử lý'),

      });
    });
      this.excelService.exportAsExcelFile(data, 'DSHP');
      this.isProcessLoadExcel = 0;
    return;
  }
}
