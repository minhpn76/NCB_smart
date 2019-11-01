import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Helper } from '../../../helper';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'link-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  listTempData: any = [];
  dataForm: FormGroup;
  submitted = false;
  itemId: any = '';
  userInfo: any;
  listTempProCode: any = [];
  listTempProd: any = [];
  listTypeId: any = [];
  listTranType: any = [];



  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private route: ActivatedRoute,
    private helper: Helper
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
    this.getTempListPro();
    this.getPrdName();
    this.getConfigTransaction();
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      prd: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      proCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      tranType: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      typeId: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: ['A', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      ccy: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      percentage: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      createdBy: [this.userInfo.userName],
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.dataForm.invalid) {
      return;
    }
    const tempArrPrd = [];
    const tempArrPro = [];
    this.dataForm.value.prd.forEach(element => {
      tempArrPrd.push(element);
    });
    this.dataForm.value.proCode.forEach(element => {
      tempArrPro.push(element);
    });
    const _codePrd = tempArrPrd.join(',');
    const _codePrdCode = tempArrPro.join(',');

    const payload = {
      proCode: _codePrdCode,
      prd: _codePrd,
      tranType: this.dataForm.value.tranType,
      typeId: this.dataForm.value.typeId,
      status: this.dataForm.value.status,
      ccy: this.dataForm.value.ccy,
      percentage: this.dataForm.value.percentage,
      createdBy: this.dataForm.value.createdBy
    };

    this.ncbService.createPromotionPackage(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code === '00') {
          this.toastr.success('Thêm thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/promotion-package');
          }, 500);
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
    this.router.navigateByUrl('/promotion-package');
  }
  // getTempListPackage() {
  //   this.listTempData = [];
  //   // xu ly
  //   this.ncbService.getAllProdName().then((result) => {
  //     const body = result.json().body;
  //     body.forEach(element => {
  //       this.listTempData.push({
  //         label: element.prdName,
  //         value: element.prd
  //       });
  //     });

  //   }).catch(err => {
  //     this.toastr.error('Vui lòng thử lại', 'Lỗi hệ thống!');
  //   });
  // }
  getTempListPro() {
    this.listTempProCode = [];
    // xu ly
    this.ncbService.getAllProCode().then((result) => {
      const body = result.json().body;
      body.forEach(element => {
        this.listTempProCode.push({
          label: element,
          value: element
        });
      });

    }).catch(err => {
      this.toastr.error('Vui lòng thử lại', 'Lỗi hệ thống!');
    });
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
  getPrdName() {
    this.listTempProd = [];
    // xu ly
    this.ncbService.getListPrdName().then((result) => {
      const body = result.json().body;
      body.forEach(element => {
        this.listTempProd.push({
          label: element,
          value: element
        });
      });

    }).catch(err => {
      this.toastr.error('Không thể lấy được dự liệu gói sản phẩm', 'Thất bại!');
    });
  }
}


