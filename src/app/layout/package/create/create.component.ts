import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { Helper } from '../../../helper';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'package-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  public Editor = ClassicEditor;
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
  dataForm: FormGroup;
  submitted = false;
  userInfo: any = [];
  listTranType: any = [

  ];

  listTypeId: any = [

  ];
  listStatus: any = [
    {
      code: 'A',
      name: 'Active'
    },
    {
      code: 'D',
      name: 'Deactive'
    }
  ];
  listCustomer: any = [
    {
      code: 'CN',
      name: 'Cá nhân'
    },
    {
      code: 'DN',
      name: 'Doanh nghiệp'
    }
  ];
  listFeeType: any = [
    {
      code: 'QLTK',
      name: 'Phí thường niên theo tháng'
    },
    {
      code: 'SMS',
      name: 'Phí thường niên SMS theo tháng'
    },
    {
      code: 'IBT',
      name: 'CK liên ngân hàng'
    },
    {
      code: 'URT',
      name: 'CK nội bộ'
    },
    {
      code: 'ISL',
      name: 'CK 247'
    },
    {
      code: 'OW6',
      name: 'Chuyển tiền vãng lai'
    }
  ];

  temp_mRatesDateS_7: any;
  temp_mRatesDateS: any;
  optionCurrency: any = { prefix: '', thousands: '.', decimal: ',', align: 'left' };


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
  }


  ngOnInit() {
    this.loadDate();
    this.getConfigTransaction();
    this.dataForm = this.formBuilder.group({
      prdName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      tranType: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      typeId: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      quantity: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      customerType: ['CN', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      ccy: ['VND', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3), this.helper.noWhitespaceValidator])],
      limitDaily: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      min: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      max: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      limitFaceid: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      limitFinger: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      promotion: [''],
      promotionName: [''],
      percentage: [''],
      // fromDate: [this.mRatesDateS],
      // toDate: [this.mRatesDateS_7],
      prd: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      createdBy: [JSON.stringify(this.userInfo.userName)],
      status: ['A', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])]
    });
    // this.getConfigDetailTransaction();
  }
  get Form() { return this.dataForm.controls; }

  tranferDate(params) {
    return params.year + '/' + params.month + '/' + params.day;
  }

  public loadDate(): void {
    this.my_7.setDate(this.my_7.getDate() - 7);
    this.mRatesDateS = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
    this.mRatesDateS_7 = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
  }

  onSubmit() {
    this.submitted = true;
    if (this.mRatesDateS_7 !== undefined && this.mRatesDateS !== undefined) {
      this.dataForm.value.toDate = this.tranferDate(this.mRatesDateS_7);
      this.dataForm.value.fromDate = this.tranferDate(this.mRatesDateS);
    }
    if (this.dataForm.invalid) {
      return;
    }
    const payload = {
      prdName: this.dataForm.value.prdName,
      tranType: this.dataForm.value.tranType,
      typeId: this.dataForm.value.typeId,
      status: this.dataForm.value.status,
      quantity: parseInt(this.dataForm.value.quantity),
      customerType: this.dataForm.value.customerType,
      ccy: this.dataForm.value.ccy,
      limitDaily: parseInt(this.dataForm.value.limitDaily),
      min: parseInt(this.dataForm.value.min),
      max: parseInt(this.dataForm.value.max),
      limitFaceid: parseInt(this.dataForm.value.limitFaceid),
      limitFinger: parseInt(this.dataForm.value.limitFinger),
      promotion: this.dataForm.value.promotion,
      promotionName: this.dataForm.value.promotionName,
      percentage: this.dataForm.value.percentage,
      // fromDate: this.dataForm.value.fromDate,
      // toDate: this.dataForm.value.toDate,
      prd: this.dataForm.value.prd,
      createdBy: JSON.parse(this.dataForm.value.createdBy)
    };

    this.ncbService.createPackage(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code === '00') {
          this.toastr.success('Thêm thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/package');
          }, 500);

        } else if (result.json().code === '914') {
          this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
        } else {
          this.toastr.error(result.json().message, 'Thất bại!');
        }
      } else {
        this.toastr.error(result.message, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/package');
  }
  getConfigTransaction() {
    this.listTranType = [];
    // xu ly
    this.ncbService.getConfigTransaction({
      code : 'FUNCTION_TYPE'
    }).then((result) => {
      this.listTranType.push({
        name: '--Chọn giá trị--',
        code: ''
      });
      setTimeout(() => {
        const body = result.json().body;
        body.forEach(element => {
          this.listTranType.push({
            name: element,
            code: element
          });
        });
      }, 300);
    }).catch(err => {
      this.toastr.error('Không lấy được dữ liệu', 'Thất bại');
    });
  }
  getConfigDetailTransaction() {
    const params = {
      code: 'FUNCTION_TYPE',
      type: this.dataForm.value.tranType
    };
    this.listTypeId = [];
    // xu ly
    this.ncbService.getConfigDetailTransaction(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listTypeId.push({
          name: '--Chọn giá trị--',
          code: ''
        });
        body.forEach(element => {
          this.listTypeId.push({
            name: element.name,
            code: element.value
          });
        });

      }, 300);
    }).catch(err => {
      this.toastr.error('Không lấy được dữ liệu', 'Thất bại');
    });
  }
}


