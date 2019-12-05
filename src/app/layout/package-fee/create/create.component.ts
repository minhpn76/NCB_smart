import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Helper } from '../../../helper';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'package-fee-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  public Editor = ClassicEditor;
  dataForm: FormGroup;
  submitted = false;
  optionCurrency: any = { prefix: '', thousands: '.', decimal: ',', align: 'left' };
  userInfo: any = [];
  cities1: any = [];
  selectedCities1: any = [];
  listTempData: any = [];

  listFeeType: any = [
    {
      code: '',
      name: '--Chọn giá trị--'
    },
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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
    this.getListPackage();
   }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      grprdId: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      prdName:  ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      feeAmount: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      ccy:  ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      feeMin:  ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      feeMax:  ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      prdCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      feeType: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      codeFee: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      taxPercent: [''],
      createdUser: [this.userInfo.userName],
      createdTime: [''],
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const tempArr = [];
    this.dataForm.value.grprdId.forEach(element => {
      tempArr.push(element);
    });
    const _code = tempArr.join(',');
    const payload = {
      grprdId: _code,
      prdName: this.dataForm.value.prdName,
      feeAmount: this.dataForm.value.feeAmount,
      feeMin: this.dataForm.value.feeMin,
      feeMax: this.dataForm.value.feeMax,
      prdCode: this.dataForm.value.prdCode,
      feeType: this.dataForm.value.feeType,
      ccy : this.dataForm.value.ccy,
      codeFee : this.dataForm.value.codeFee,
      taxPercent : this.dataForm.value.taxPercent,
      createdUser: this.dataForm.value.createdUser,
      createdTime: this.dataForm.value.createdTime
    };

    this.ncbService.createPackageFee(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Thêm thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/package-fee');
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
    this.router.navigateByUrl('/package-fee');
  }
  getListPackage() {
    this.listTempData = [];
    // xu ly
    this.ncbService.searchPackage({
      page: 0,
      size: 1000
    }).then((result) => {
      const body = result.json().body;
      body.content.forEach(element => {
        this.listTempData.push({
          label: element.prdName,
          value: element.prd
        });
      });

    }).catch(err => {
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
}


