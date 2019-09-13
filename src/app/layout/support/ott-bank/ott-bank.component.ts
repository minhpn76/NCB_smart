import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'support-ottbank',
  templateUrl: './ott-bank.component.html',
  styleUrls: ['./ott-bank.component.css'],
  providers: [NCBService]
})
export class SupportOttBankComponent implements OnInit {
  listPGD: any = [];
  listBranch: any = [];
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
  search: any = {
    keyword: '',
    name: '',
    name_telecom: '',
    page: 1,
    page_size: 10,
    total_items: 0,
    previous_page: 0,
    process_load: 0,
    process_export: 0,
    active: 2
  };
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

  constructor(
    private ncbService: NCBService
  ) { }

  ngOnInit() {
    this.getListData(this.search);
    this.getListBranch();
    this.getListPGD();

    this.loadDate();
    console.log('--mRatesDateS_7', this.mRatesDateS_7);
    console.log('--mRatesDateS', this.mRatesDateS);

  }
  public loadDate(): void {
    this.my_7.setDate(this.my_7.getDate() - 7);
    this.mRatesDateS_7 = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
    this.mRatesDateS = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
  }
  getListData(params) {
    this.search.process_load = 1;
    // xu ly
    this.listData = [{
        'city': 'Cần Thơ',
        'province': 'Cần Thơ',
        'area': '1,408.9',
        'population': '1,248,000'
      },
      {
          'city': 'Đà Nẵng',
          'province': 'Đà Nẵng',
          'area': '1,285.4',
          'population': '1,028,000'
      },
      {
          'city': 'Hải Phòng',
          'province': 'Hải Phòng',
          'area': '1,527.4',
          'population': '1,963,300'
      },
      {
          'city': 'Hà Nội',
          'province': 'Hà Nội',
          'area': '3,324.5',
          'population': '7,216,000'
      },
      {
          'city': 'Hồ Chí Minh',
          'province': 'Hồ Chí Minh',
          'area': '2,095.5',
          'population': '8,146,300'
      },
      {
          'city': 'Bà Rịa',
          'province': 'Bà Rịa–Vũng Tàu',
          'area': '91.46',
          'population': '122,424'
      },
      {
          'city': 'Bạc Liêu',
          'province': 'Bạc Liêu',
          'area': '175.4',
          'population': '188,863'
      },
      {
          'city': 'Bắc Giang',
          'province': 'Bắc Giang',
          'area': '32.21',
          'population': '126,810'
      },
      {
          'city': 'Bắc Ninh',
          'province': 'Bắc Ninh',
          'area': '80.28',
          'population': '272,634'
      },
      {
          'city': 'Bảo Lộc',
          'province': 'Lâm Đồng',
          'area': '232.56',
          'population': '153,362'
      },
      {
          'city': 'Biên Hòa',
          'province': 'Đồng Nai',
          'area': '264.07',
          'population': '1,104,495'
      },
      {
          'city': 'Bến Tre',
          'province': 'Bến Tre',
          'area': '67.48',
          'population': '143,312'
      }];
    this.search.total_items = this.listData.length;
    this.search.process_load = 0;

  }
  getListBranch() {
    // xu ly
    this.listBranch = [];
    const params = {};
    this.ncbService.getListBranch(params).then((result) => {
      this.listBranch.push({code: '', name: 'Tất cả'});
      result.json().body.forEach(element => {
        this.listBranch.push({
          code: element.branchCode,
          name: element.branchName,
        });
      });


    }).catch((err) => {

    });


  }
  getListPGD() {
    this.listPGD = [];
    const params = {};

    this.ncbService.getListTransaction(params).then((result) => {
      this.listPGD.push({ code: '', name: 'Tất cả' });

      result.json().body.forEach(element => {
        this.listPGD.push({
          code: element.transactionCode,
          name: element.transactionName,
        });
      });

    }).catch((err) => {

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

}
