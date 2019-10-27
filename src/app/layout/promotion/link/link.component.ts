import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Helper } from '../../../helper';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'provision-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
  providers: [NCBService, Helper]
})
export class LinkComponent implements OnInit {
  listTempData: any = [];
  dataForm: FormGroup;
  submitted = false;
  itemId: any = '';


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private route: ActivatedRoute,
    private helper: Helper
  ) {
    this.route.params.subscribe(params => {
      this.itemId = params.itemId;
    });
    this.getListPackage();
  }

  ngOnInit() {
    this.getItem(this.itemId);
    this.dataForm = this.formBuilder.group({
      proCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      listPackage: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])]
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.dataForm.invalid) {
      return;
    }
    const tempArr = [];
    this.dataForm.value.grprdId.forEach(element => {
      tempArr.push(element);
    });
    const _code = tempArr.join(',');
    const payload = {
      proCode: this.dataForm.value.proCode,
      listPackage: _code
    };

    // this.ncbService.createPromotion(payload).then((result) => {
    //   if (result.status === 200) {
    //     if (result.json().code !== '00') {
    //       this.toastr.error(result.json().message, 'Thất bại!');
    //     }  else if (result.json().code === '911') {
    //       this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
    //     } else {
    //       this.toastr.success('Thêm thành công', 'Thành công!');
    //       setTimeout(() => {
    //         this.router.navigateByUrl('/promotion');
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
    this.router.navigateByUrl('/promotion');
  }
  async getItem(params) {
    await this.ncbService.detailPromotion({ proCode: params }).then((result) => {
      const body = result.json().body;
      setTimeout(() => {
        this.dataForm.patchValue({
          proCode: body.proCode
        });
      }, 500);

    }).catch(err => {
      this.toastr.error('Lỗi hệ thống', 'Thất bại!');
    });
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
      this.toastr.error('Vui lòng thử lại', 'Lỗi hệ thống!');
    });
  }
}


