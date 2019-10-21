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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
    this.cities1 = [
      {label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}},
      {label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}},
      {label: 'London', value: {id: 3, name: 'London', code: 'LDN'}},
      {label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}},
      {label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}}
    ];
   }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      grprdId: [[], Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      prdName:  ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      feeAmount: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      ccy:  ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      feeMin:  ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      feeMax:  ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      prdCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      feeType: ['QLTK', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      createBy: [JSON.stringify(this.userInfo.userName)]
    });
    console.log('==this.selectedCities1', this.selectedCities1);
  }
  get Form() { return this.dataForm.controls; }
  // onChange(event) {
  //   const tempArr = [];
  //   event.value.forEach(element => {
  //     tempArr.push(element.code);
  //   });
  //   const _code = tempArr.join(',');
  //   this.dataForm.patchValue({
  //     grprdId: _code
  //   });
  // }

  onSubmit() {
    this.submitted = true;
    console.log('==this.dataForm', this.dataForm.value);

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const tempArr = [];
    this.dataForm.value.grprdId.forEach(element => {
      tempArr.push(element.code);
    });
    const _code = tempArr.join(',');
    console.log('==x', _code);

    // this.ncbService.createNcbGuide(this.dataForm.value).then((result) => {
    //   if (result.status === 200) {
    //     if (result.json().code !== '00') {
    //       this.toastr.error(result.json().message, 'Thất bại!');
    //     } else {
    //       this.toastr.success('Thêm thành công', 'Thành công!');
    //       setTimeout(() => {
    //         this.router.navigateByUrl('/guide');
    //       }, 500);
    //     }
    //   } else {
    //     this.toastr.error(result.message, 'Thất bại!');
    //   }
    // }).catch((err) => {
    //   this.toastr.error(err.json().message, 'Thất bại!');
    // });
  }
  resetForm() {
    this.router.navigateByUrl('/package-fee');
  }
}


