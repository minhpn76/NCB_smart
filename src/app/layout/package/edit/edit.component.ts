import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Helper } from '../../../helper';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'provision-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  public Editor = ClassicEditor;
  dataForm: FormGroup;
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
  submitted = false;
  itemId: any;
  obj: any = {
    status: '',
    serviceId: '',
    content: ''
  };
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
  optionCurrency: any = { prefix: '', thousands: '.', decimal: ',', align: 'left' };
  userInfo: any;
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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService,
    private helper: Helper
  ) {
      this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
      this.route.params.subscribe(params => {
        this.itemId = params.itemId;
      });

   }

  ngOnInit() {
    this.getItem(this.itemId);
    this.dataForm = this.formBuilder.group({
      id: [''],
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
      promotion: [''],
      promotionName: [''],
      percentage: [''],
      fromDate: ['', this.mRatesDateS],
      toDate: ['', this.mRatesDateS_7],
      prd: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      createBy: [JSON.stringify(this.userInfo.userName)],
      status : ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
    });
  }
  get Form() { return this.dataForm.controls; }
  public loadDate(): void {
    this.my_7.setDate(this.my_7.getDate() - 7);
    this.mRatesDateS = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
    this.mRatesDateS_7 = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
  }

  tranferDate(params) {
    return params.year + '/' + params.month + '/' + params.day;
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
      id: this.dataForm.value.id,
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
      fromDate: this.helper.tranferDate(this.dataForm.value.fromDate),
      toDate: this.helper.tranferDate(this.dataForm.value.toDate),
      prd: this.dataForm.value.prd,
      createBy: parseInt(this.dataForm.value.createBy)
    };
    this.ncbService.updatePackage(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
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
  getItem(params) {
    this.ncbService.detailPackage({prd: params}).then((result) => {
      const body = result.json().body;
      const temp_fromDate_slipt = body.fromDate.split('-');
      const temp_fromDate = {
        year: parseInt(temp_fromDate_slipt[0]),
        month: parseInt(temp_fromDate_slipt[1]),
        day: parseInt(temp_fromDate_slipt[2])
      };

      const temp_toDate_slipt = body.toDate.split('-');
      const temp_toDate = {
        year: parseInt(temp_toDate_slipt[0]),
        month: parseInt(temp_toDate_slipt[1]),
        day: parseInt(temp_toDate_slipt[2])
      };
      // con
      try {
        this.dataForm.patchValue({
          id: body.id !== null ? body.id : '',
          prdName: body.prdName !== null ? body.prdName : '',
          tranType: body.tranType !== null ? body.tranType : '',
          typeId: body.typeId !== null ? body.typeId : '',
          quantity: body.quantity !== null ? body.quantity : '',
          customerType: body.customerType !== null ? body.customerType : '',
          ccy: body.ccy !== null ? body.ccy : '',
          limitDaily: body.limitDaily !== null ? body.limitDaily : '',
          min: body.min !== null ? body.min : '',
          max: body.max !== null ? body.max : '',
          limitFaceid: body.limitFaceid !== null ? body.limitFaceid : '',
          limitFinger: body.limitFinger !== null ? body.limitFinger : '',
          promotion: body.promotion !== null ? body.promotion : '',
          promotionName: body.promotionName !== null ? body.promotionName : '',
          percentage: body.percentage !== null ? body.percentage : '',
          fromDate: temp_fromDate !== null ? temp_fromDate : '',
          toDate: temp_toDate !== null ? temp_toDate : '',
          prd: body.prd !== null ? body.prd : '',
          createBy: body.createBy !== null ? body.createBy : '',
          status: body.status !== null ? body.status : ''
        });
      } catch (e) {
        console.log('e', e);
      }
    }).catch(err => {

    });
  }
}



