import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { Helper } from '../../../helper';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'provision-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  public Editor = ClassicEditor;

  mRatesDateS_1: NgbDateStruct;
  mRatesDateS_7_1: NgbDateStruct;
  my_1: any = new Date();
  my_7_1: any = new Date();
  temp_mRatesDateS_7_1: any;
  temp_mRatesDateS_1: any;

  mRatesDateS_2: NgbDateStruct;
  mRatesDateS_7_2: NgbDateStruct;
  my_2: any = new Date();
  my_7_2: any = new Date();
  temp_mRatesDateS_7_2: any;
  temp_mRatesDateS_2: any;

  mRatesDateS_3: NgbDateStruct;
  mRatesDateS_7_3: NgbDateStruct;
  my_3: any = new Date();
  my_7_3: any = new Date();
  temp_mRatesDateS_7_3: any;
  temp_mRatesDateS_3: any;

  mRatesDateS_4: NgbDateStruct;
  mRatesDateS_7_4: NgbDateStruct;
  my_4: any = new Date();
  my_7_4: any = new Date();
  temp_mRatesDateS_7_4: any;
  temp_mRatesDateS_4: any;
  tempArrPackage: any = [];
  optionCurrency: any = { prefix: '', thousands: '.', decimal: ',', align: 'left' };
  userInfo: any;
  listPrdName: any;

  package: any = {
    ALL: false,
    NCB: false,
    IZI: false,
    VIP2: false,
    VIP3: false,
    GAMI: false
  };
  dataForm: FormGroup;
  eventFrom: FormGroup;
  submitted = false;
  listSelect: any = [
    {
      code: '',
      name: 'Miễn phí'
    },
    {
      code: '10',
      name: '10%'
    },
    {
      code: '20',
      name: '20%'
    },
    {
      code: '30',
      name: '30%'
    },
    {
      code: '40',
      name: '40%'
    },
    {
      code: '50',
      name: '50%'
    },
    {
      code: '60',
      name: '60%'
    },
    {
      code: '70',
      name: '70%'
    },
    {
      code: '80',
      name: '80%'
    },
    {
      code: '90',
      name: '90%'
    },
    {
      code: '100',
      name: '100%'
    }
  ];
  listPromotion: any = [
    {
      code: '',
      name: 'Tất cả'
    },
    {
      code: '1',
      name: 'NCB'
    },
    {
      code: '2',
      name: 'IZI'
    },
    {
      code: '3',
      name: 'VIP2'
    },
    {
      code: '4',
      name: 'GAMI'
    },
    {
      code: '5',
      name: 'VIP3'
    }
  ];
  listCustomer: any = [
    {
      code: '',
      name: 'Tất cả'
    },
    {
      code: '2C',
      name: 'Vàng'
    },
    {
      code: '3B',
      name: 'Bạc'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper
  ) {
    this.getPrdName();
    this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
  }

  ngOnInit() {
    this.loadDate();
    this.dataForm = this.formBuilder.group({
      proCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      proName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      proDes: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      fromDate: [this.mRatesDateS_1],
      toDate: [this.mRatesDateS_7_1],
      // createdDate: [''],
      createdBy: [this.userInfo.userName],
      status: ['A']
    });
  }
  get Form() { return this.dataForm.controls; }
  tranferDate(params) {
    return params.year + '/' + params.month + '/' + params.day;
  }

  tranferDateMinus(params) {
    return params.year + '-' + params.month + '-' + params.day;
  }
  public loadDate(): void {
    this.my_7_1.setDate(this.my_7_1.getDate() - 7);

    this.mRatesDateS_1 = { year: this.my_7_1.getFullYear(), month: this.my_7_1.getMonth() + 1, day: this.my_7_1.getDate() };
    this.mRatesDateS_7_1 = { year: this.my_1.getFullYear(), month: this.my_1.getMonth() + 1, day: this.my_1.getDate() };

  }
  onSubmit() {
    this.submitted = true;
    // if (this.mRatesDateS_7_1 !== undefined && this.mRatesDateS_1 !== undefined) {
    //   this.dataForm.value.toDate = this.tranferDate(this.mRatesDateS_7_1);
    //   this.dataForm.value.fromDate = this.tranferDate(this.mRatesDateS_1);
    // }

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    if (new Date(this.tranferDateMinus(this.dataForm.value.fromDate)) > new Date(this.tranferDateMinus(this.dataForm.value.toDate))) {
      this.toastr.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'Thất bại!');
      return;
    }

    const payload = {
      proCode: this.dataForm.value.proCode,
      proName: this.dataForm.value.proName,
      proDes: this.dataForm.value.proDes,
      fromDate: this.helper.tranferDate(this.dataForm.value.fromDate),
      toDate: this.helper.tranferDate(this.dataForm.value.toDate),
      createdBy: this.dataForm.value.createdBy,
      // createdDate: this.dataForm.value.createdDate,
      status: this.dataForm.value.status
    };

    this.ncbService.createPromotion(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        }  else if (result.json().code === '911') {
          this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
        } else {
          this.toastr.success('Thêm thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/promotion');
          }, 500);
        }
      } else {
        this.toastr.error(result.message, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/promotion');
  }
  getPrdName() {
    this.listPrdName = [];
    // xu ly
    this.ncbService.getListPrdName().then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listPrdName = body;
      }, 300);
    }).catch(err => {
      this.toastr.error('Không thể lấy được dự liệu gói sản phẩm', 'Thất bại!');
    });
  }
  changePackage(event, code) {
    const parseName = event.target.id.toString();
    if (this.tempArrPackage.length === 0) {
      this.tempArrPackage.push(parseName);
    } else {
      this.tempArrPackage.forEach(element => {
        if (element !== parseName) {
          if (this.tempArrPackage.includes(parseName) === true) {
            return;
          } else {
            this.tempArrPackage.push(parseName);
          }
        } else {
          if (this.tempArrPackage.includes(parseName) === true) {
            this.tempArrPackage = this.tempArrPackage.filter(e => e !== element.toString());
          } else {
            return;
          }
        }
      });
    }
  }
}


