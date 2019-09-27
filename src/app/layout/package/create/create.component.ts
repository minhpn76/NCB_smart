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
    {
      code: 'CK',
      name: 'Chuyển khoản'
    },
    {
      code: 'TK',
      name: 'Tiết kiệm'
    },
    {
      code: 'TT',
      name: 'Thanh toán'
    },
    {
      code: 'TOPUP',
      name: 'Nạp tiền'
    },
    {
      code: 'QLTK',
      name: 'Phí thường niên',

    }
  ];

  listTypeId: any = [
    {
      code: 'IBT',
      name: 'Chuyển khoản LNH'
    },
    {
      code: 'URT',
      name: 'Chuyển khoản nội bộ'
    },
    {
      code: 'ISL',
      name: 'CK 247'
    },
    {
      code: 'OW6',
      name: 'Chuyển tiền vãng lai'
    },
    {
      code: 'BILL',
      name: 'Thanh toán hóa đơn'
    },
    {
      code: 'TOP',
      name: 'Nạp tiền điện thoại'
    },
    {
      code: 'EWL',
      name: 'Nạp ví điện tử'
    },
    {
      code: 'IZI',
      name: 'Nạp tiền vào TK IZI'
    }
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

  temp_mRatesDateS_7: any;
  temp_mRatesDateS: any;


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
    this.dataForm = this.formBuilder.group({
      prdName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      tranType: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      typeId: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      quantity: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      customerType: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      ccy: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      limitDaily: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      min: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      max: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      limitFaceid: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      limitFinger: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      promotion: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      promotionName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      percentage: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      fromDate: [this.mRatesDateS],
      toDate: [this.mRatesDateS_7],
      prd: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      createBy: [JSON.stringify(this.userInfo.userId)],
      status : ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
    });
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
      percentage: parseInt(this.dataForm.value.percentage),
      fromDate: this.dataForm.value.fromDate,
      toDate: this.dataForm.value.toDate,
      prd: this.dataForm.value.prd,
      createBy: parseInt(this.dataForm.value.createBy)
    };
    this.ncbService.createPackage(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Thêm thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/package');
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
    this.router.navigateByUrl('/package');
  }
}


