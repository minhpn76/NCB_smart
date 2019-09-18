import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'provision-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService]
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

  package: any = {
    ALL: false,
    NCB: false,
    IZI: false,
    VIP2: false,
    VIP3: false,
    GAMI: false
  };
  dataForm: FormGroup;
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
    public router: Router
  ) {}

  ngOnInit() {
    this.loadDate();

    this.dataForm = this.formBuilder.group({
      customerType: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern(/^((?!\s{2,}).)*$/)])],
      promotionName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      promotion: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      percentage1: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      fromDate1: [this.mRatesDateS_1],
      toDate1: [this.mRatesDateS_7_1],
      percentage2: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      fromDate2: [this.mRatesDateS_2],
      toDate2: [this.mRatesDateS_7_2],
      percentage3: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      fromDate3: [this.mRatesDateS_3],
      toDate3: [this.mRatesDateS_7_3],
      percentage4: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      fromDate4: [this.mRatesDateS_4],
      toDate4: [this.mRatesDateS_7_4],
      prdName: [''],
      status: 'A',
      package_ALL: [false],
      package_NCB: [false],
      package_IZI: [false],
      package_VIP2: [false],
      package_VIP3: [false],
      package_GAMI: [false]
    });
  }
  get Form() { return this.dataForm.controls; }

  tranferDate(params) {
    return params.year + '/' + params.month + '/' + params.day;
  }
  public loadDate(): void {
    this.my_7_1.setDate(this.my_7_1.getDate() - 7);
    this.my_7_2.setDate(this.my_7_2.getDate() - 7);
    this.my_7_3.setDate(this.my_7_3.getDate() - 7);
    this.my_7_4.setDate(this.my_7_4.getDate() - 7);

    this.mRatesDateS_1 = { year: this.my_7_1.getFullYear(), month: this.my_7_1.getMonth() + 1, day: this.my_7_1.getDate() };
    this.mRatesDateS_7_1 = { year: this.my_1.getFullYear(), month: this.my_1.getMonth() + 1, day: this.my_1.getDate() };

    this.mRatesDateS_2 = { year: this.my_7_2.getFullYear(), month: this.my_7_2.getMonth() + 1, day: this.my_7_2.getDate() };
    this.mRatesDateS_7_2 = { year: this.my_2.getFullYear(), month: this.my_2.getMonth() + 1, day: this.my_2.getDate() };

    this.mRatesDateS_3 = { year: this.my_7_3.getFullYear(), month: this.my_7_3.getMonth() + 1, day: this.my_7_3.getDate() };
    this.mRatesDateS_7_3 = { year: this.my_3.getFullYear(), month: this.my_3.getMonth() + 1, day: this.my_3.getDate() };

    this.mRatesDateS_4 = { year: this.my_7_4.getFullYear(), month: this.my_7_4.getMonth() + 1, day: this.my_7_4.getDate() };
    this.mRatesDateS_7_4 = { year: this.my_4.getFullYear(), month: this.my_4.getMonth() + 1, day: this.my_4.getDate() };
  }

  onSubmit() {
    this.submitted = true;
    if (this.mRatesDateS_7_1 !== undefined && this.mRatesDateS_1 !== undefined) {
      this.dataForm.value.toDate1 = this.tranferDate(this.mRatesDateS_7_1);
      this.dataForm.value.fromDate1 = this.tranferDate(this.mRatesDateS_1);
    }
    if (this.mRatesDateS_7_2 !== undefined && this.mRatesDateS_2 !== undefined) {
      this.dataForm.value.toDate2 = this.tranferDate(this.mRatesDateS_7_2);
      this.dataForm.value.fromDate2 = this.tranferDate(this.mRatesDateS_2);
    }
    if (this.mRatesDateS_7_3 !== undefined && this.mRatesDateS_3 !== undefined) {
      this.dataForm.value.toDate3 = this.tranferDate(this.mRatesDateS_7_3);
      this.dataForm.value.fromDate3 = this.tranferDate(this.mRatesDateS_3);
    }
    if (this.mRatesDateS_7_4 !== undefined && this.mRatesDateS_4 !== undefined) {
      this.dataForm.value.toDate4 = this.tranferDate(this.mRatesDateS_7_4);
      this.dataForm.value.fromDate4 = this.tranferDate(this.mRatesDateS_4);
    }

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const payload = {
      customerType: this.dataForm.value.customerType,
      promotionName: this.dataForm.value.promotionName,
      promotion: this.dataForm.value.promotion,
      percentage1: this.dataForm.value.percentage1,
      fromDate1: this.dataForm.value.fromDate1,
      toDate1: this.dataForm.value.toDate1,
      percentage2: this.dataForm.value.percentage2,
      fromDate2: this.dataForm.value.fromDate2,
      toDate2: this.dataForm.value.toDate2,
      percentage3: this.dataForm.value.percentage3,
      fromDate3: this.dataForm.value.fromDate3,
      toDate3: this.dataForm.value.toDate3,
      percentage4: this.dataForm.value.percentage4,
      fromDate4: this.dataForm.value.fromDate4,
      toDate4: this.dataForm.value.toDate4,
      prdName: JSON.stringify(this.tempArrPackage),
    };

    this.ncbService.createPromotion(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
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
  changePackage(event) {
    if (event.target.name === 'ALL') {
      if (event.target.checked === true) {
        this.tempArrPackage = ['NCB', 'IZI', 'VIP2', 'VIP3', 'GAMI'];
        this.dataForm.patchValue({
          package_ALL: true,
          package_NCB: true,
          package_IZI: true,
          package_VIP2: true,
          package_VIP3: true,
          package_GAMI: true
        });
      } else {
        this.tempArrPackage = [];
        this.dataForm.patchValue({
          package_ALL: false,
          package_NCB: false,
          package_IZI: false,
          package_VIP2: false,
          package_VIP3: false,
          package_GAMI: false
        });
      }
    } else if (event.target.name === 'NCB') {
      if (event.target.checked === true) {
        if (this.tempArrPackage.includes('NCB') === false) {
          this.tempArrPackage.push('NCB');
          this.dataForm.patchValue({
            package_NCB: true
          });
        } else {
          this.dataForm.patchValue({
            package_NCB: false
          });
        }
      } else {
        if (this.tempArrPackage.includes('NCB') === true) {
          this.tempArrPackage = this.tempArrPackage.filter(e => e !== 'NCB');
          this.dataForm.patchValue({
            package_NCB: false
          });
        } else {
          this.dataForm.patchValue({
            package_NCB: true
          });
        }
      }
    } else if (event.target.name === 'IZI') {
      if (event.target.checked === true) {
        if (this.tempArrPackage.includes('IZI') === false) {
          this.tempArrPackage.push('IZI');
          this.dataForm.patchValue({
            package_IZI: true
          });
        } else {

          this.dataForm.patchValue({
            package_IZI: false
          });
        }
      } else {
        if (this.tempArrPackage.includes('IZI') === true) {
          this.tempArrPackage = this.tempArrPackage.filter(e => e !== 'IZI');
          this.dataForm.patchValue({
            package_IZI: false
          });
        } else {
          this.dataForm.patchValue({
            package_IZI: true
          });
        }
      }
    } else if (event.target.name === 'VIP2') {
      if (event.target.checked === true) {
        if (this.tempArrPackage.includes('VIP2') === false) {
          this.tempArrPackage.push('VIP2');
          this.dataForm.patchValue({
            package_VIP2: true
          });
        } else {
          this.dataForm.patchValue({
            package_VIP2: false
          });
        }
      } else {
        if (this.tempArrPackage.includes('VIP2') === true) {
          this.tempArrPackage = this.tempArrPackage.filter(e => e !== 'VIP2');
          this.dataForm.patchValue({
            package_VIP2: false
          });
        } else {
          this.dataForm.patchValue({
            package_VIP2: false
          });
        }
      }
    } else if (event.target.name === 'VIP3') {
      if (event.target.checked === true) {
        if (this.tempArrPackage.includes('VIP3') === false) {
          this.tempArrPackage.push('VIP3');
          this.dataForm.patchValue({
            package_VIP3: true
          });
        } else {
          this.dataForm.patchValue({
            package_VIP3: false
          });
        }
      } else {
        if (this.tempArrPackage.includes('VIP3') === true) {
          this.tempArrPackage = this.tempArrPackage.filter(e => e !== 'VIP3');
          this.dataForm.patchValue({
            package_VIP3: false
          });
        } else {
          this.dataForm.patchValue({
            package_VIP3: true
          });
        }
      }
    } else if (event.target.name === 'GAMI') {
      if (event.target.checked === true) {
        if (this.tempArrPackage.includes('GAMI') === false) {
          this.tempArrPackage.push('GAMI');
          this.dataForm.patchValue({
            package_GAMI: true
          });
        } else {
          this.dataForm.patchValue({
            package_GAMI: false
          });
        }
      } else {
        if (this.tempArrPackage.includes('GAMI') === true) {
          this.tempArrPackage = this.tempArrPackage.filter(e => e !== 'GAMI');
          this.dataForm.patchValue({
            package_GAMI: false
          });
        } else {
          this.dataForm.patchValue({
            package_GAMI: true
          });
        }
      }
    }
  }
}


