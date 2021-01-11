import { Helper } from './../../../helper';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';
import { NCBService } from '../../../services/ncb.service';
import Swal from 'sweetalert2';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporttuition',
  templateUrl: './reporttuition.component.html',
  styleUrls: ['./reporttuition.component.scss'],
  providers: [NCBService, Helper]
})
export class ReporttuitionComponent implements OnInit {
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
  my_14: any = new Date();
  listSchool: any;
  re_search = {
    schoolCode: '',
    startDate: '',
    studentCode: '',
    endDate: '',
    status: -1,
    offset: 10,
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
    }
  ];
  listPageSize: any = [10, 20, 30, 40, 50];
  search_keyword: any = '';
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;
  listData: any[];


  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    public helper: Helper,
    private router: Router
  ) {
    localStorage.setItem('redirect', 'false');
    this.loadDate();
  }

  ngOnInit() {
      this.getSchools();
  }
  loadPage(page: number)  {
    const page_number = page;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.onSearch(this.re_search);
    }
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
      const body = result.json().body;
      this.listSchool = body;
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  /*Câ[j nhat lại ham sert tai day] */
  onSearch(payload) {
    this.listData = [];
    this.isProcessLoad = 1;
    payload.startDate = this.helper.tranferDate(this.mRatesDateS);
    payload.endDate = this.helper.tranferDate(this.mRatesDateS_7);
    this.ncbService.getListHpTuition(payload).then(result => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body;
        this.totalSearch = body.total;
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
    // xu ly
    this.ncbService.getListHpTuition(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body;
        this.totalSearch = body.total;
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
}
