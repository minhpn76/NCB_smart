import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Helper } from '../../../helper';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'promotion-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, DatePipe, Helper]
})
export class EditComponent implements OnInit {
  public Editor = ClassicEditor;
  dataForm: FormGroup;

  mRatesDateS_1: NgbDateStruct;
  mRatesDateS_7_1: NgbDateStruct;
  my_1: any = new Date();
  my_7_1: any = new Date();
  temp_mRatesDateS_7_1: any;
  temp_mRatesDateS_1: any;
  tempPrdName: any = [];

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

  submitted = false;
  itemId: any;
  listStatus: any = [
    {
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Deactive',
      code: 'D',
    }
  ];
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
  tempArrPackage: any = [];
  userInfo: any;
  listPrdName: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService,
    private dataPipe: DatePipe,
    private helper: Helper
  ) {
    this.route.params.subscribe(params => {
      this.itemId = params.Id;
    });
    this.getPrdName();
    this.userInfo = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : '';

   }

  ngOnInit() {
    this.getItem(this.itemId);
    this.loadDate();
    this.dataForm = this.formBuilder.group({
      customerType: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2), this.helper.noWhitespaceValidator])],
      promotionName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      promotion: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      percentage: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      fromDate: [''],
      toDate: [''],
      status: [''],
      prdName: [''],
      tranType: [''],
      typeId: [''],
      createdBy: [JSON.stringify(this.userInfo.userName)]
    });
  }
  get Form() { return this.dataForm.controls; }

  public loadDate(): void {
    this.my_7_1.setDate(this.my_7_1.getDate() - 7);
    this.mRatesDateS_1 = { year: this.my_7_1.getFullYear(), month: this.my_7_1.getMonth() + 1, day: this.my_7_1.getDate() };
    this.mRatesDateS_7_1 = { year: this.my_1.getFullYear(), month: this.my_1.getMonth() + 1, day: this.my_1.getDate() };
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    if (this.dataForm.value.prdName === '') {
      this.toastr.error('Gói sp áp dụng không được bỏ trống', 'Thất bại!');
      return;
    }
    const passData = {
      customerType: this.dataForm.value.customerType,
      promotionName: this.dataForm.value.promotionName,
      promotion: this.dataForm.value.promotion,
      percentage: this.dataForm.value.percentage,
      fromDate: this.helper.tranferDate(this.dataForm.value.fromDate),
      toDate: this.helper.tranferDate(this.dataForm.value.toDate),
      createdBy: this.dataForm.value.createdBy,
      tranType: this.dataForm.value.tranType,
      typeId: this.dataForm.value.typeId,
      createdDate: this.helper.formatDate(new Date()),
      prdName: this.tempArrPackage.join(','),
      status: this.dataForm.value.status
    };

    const payload = {
      id: this.itemId,
      ...passData
    };

    this.ncbService.updatePromotion(payload).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/promotion');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
  getPrdName() {
    this.listPrdName = [];
    // xu ly
    this.ncbService.getListPrdName().then((result) => {
      const body = result.json().body;
      this.tempPrdName = body;

      body.forEach(element => {
        this.listPrdName.push({
          name: element,
          code: false
        });
      });
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
  async getItem(params) {
    this.ncbService.detailPromotion({ id: params }).then((result) => {
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

      // change
      const tempPackage = (body.prdName !== null) ? body.prdName.split(',') : [];
      tempPackage.forEach(element => {
        if (this.tempPrdName.includes(element) === true) {
          this.listPrdName = this.listPrdName.filter(e => e.name !== element.toString());
          this.listPrdName.push({
            name: element,
            code: true
          });
        }
      });
      const tempListPrdName = this.listPrdName.filter(e => e.code === true);
      tempListPrdName.forEach(element => {
        this.tempArrPackage.push(element.name);
      });
      // end

      this.dataForm.patchValue({
        customerType: body.customerType,
        promotionName: body.promotionName,
        promotion: body.promotion,
        percentage: body.percentage,
        // tslint:disable-next-line:no-bitwise
        fromDate: temp_fromDate,
        toDate: temp_toDate,
        prdName: tempPackage,
        status: body.status,
        tranType: body.tranType,
        typeId: body.typeId
      });
    }).catch(err => {
      console.log('===', err);
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/promotion');
  }
}



