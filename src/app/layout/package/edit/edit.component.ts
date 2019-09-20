import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'provision-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService]
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
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Deactive',
      code: 'D',
    }
  ];
  userInfo: any;
  listCustomer: any = [
    {
      code: '',
      name: 'Tất cả'
    },
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
      code: '',
      name: 'Tất cả'
    },
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
      code: '',
      name: 'Tất cả'
    },
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
    private ncbService: NCBService
  ) {
      this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
      this.route.params.subscribe(params => {
        this.itemId = params.itemId;
      });

   }

  ngOnInit() {
    this.getItem(this.itemId);
    this.dataForm = this.formBuilder.group({
      prdName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      tranType: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      typeId: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      quantity: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      customerType: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      ccy: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      limitDaily: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      min: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      max: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      limitFaceid: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      limitFinger: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      promotion: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      promotionName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      percentage: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      fromDate: ['', this.mRatesDateS],
      toDate: ['', this.mRatesDateS_7],
      prd: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      createBy: [JSON.stringify(this.userInfo.userId)],
      status : ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
    });
  }
  get Form() { return this.dataForm.controls; }
  public loadDate(): void {
    this.my_7.setDate(this.my_7.getDate() - 7);
    this.mRatesDateS = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
    this.mRatesDateS_7 = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
  }
  onSubmit() {
    this.submitted = true;
    if (this.obj.content === '' || this.obj.serviceId === '') {
      this.toastr.error('Không được để trống các trường', 'Lỗi!');
      return;
    }
    const id = {
      id: this.itemId
    };
    const data = {
      ...this.obj,
      ...id
    };
    this.ncbService.updateNcbGuide(data).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/provision');
          }, 500);
        }
      } else {
        this.toastr.error(result.message, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.message, 'Thất bại!');

    });
  }
  resetForm() {
    this.router.navigateByUrl('/provision');
  }
  getItem(params) {
    this.ncbService.detailPackage({prdName: params}).then((result) => {
      const body = result.json().body;
      console.log('!@#!@', body);
      this.dataForm.patchValue({
        prdName: body.prdName
      });
    }).catch(err => {

    });
  }
}



