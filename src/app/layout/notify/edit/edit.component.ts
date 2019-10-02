import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Helper } from '../../../helper';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'notify-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  public Editor = ClassicEditor;
  dataForm: FormGroup;
  submitted = false;
  itemId: any;
  userInfo: any;
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
  listProvider: any = ['VNPAY', 'PAYOO', 'NAPAS', 'NCB'];
  listType: any = [
    {
      name: 'IBT',
      code: 'CK liên ngân hàng'
    },
    {
      name: 'URT',
      code: 'CK nội bộ'
    },
    {
      name: 'ISL',
      code: 'CK 247'
    },
    {
      name: 'OW6',
      code: 'Gửi tiết kiệm'
    },
    {
      name: 'IBT',
      code: 'CK liên ngân hàng'
    },
    {
      name: 'PLUS',
      code: 'Nộp thêm tiết kiệm'
    },
    {
      name: 'REDEEM',
      code: 'Tất toán tiết kiệm'
    },
    {
      name: 'BILL',
      code: 'Thanh toán hóa đơn'
    },
    {
      name: 'TOP',
      code: 'Nạp tiền điện thoại'
    },
    {
      name: 'EWL',
      code: 'Nạp ví điện tử'
    },
    {
      name: 'IZI',
      code: 'Nạp tiền vào tkhoan IZI'
    },
    {
      name: 'SYSTEM',
      code: 'Mã lỗi chung, khác của hệ thống'
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
    this.userInfo = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : '';
    this.route.params.subscribe(params => {
      this.itemId = params.itemId;
    });
  }
  get Form() { return this.dataForm.controls; }

  ngOnInit() {
    this.getItem(this.itemId);
    this.dataForm = this.formBuilder.group({
      provider: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      type: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      error: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      msgCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      msg_Code_1: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      mes_Vn: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      mes_En: [''],
      user_Id: [JSON.stringify(this.userInfo.userId)],
      // status: ['']
    });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }

    this.ncbService.updateNotify(this.dataForm.value).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().description, 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/notify');
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
    this.router.navigateByUrl('/notify');
  }
  getItem(params) {
    this.ncbService.detailNotify({
      msgCode: params
    }).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        provider: body.provider,
        type: body.type,
        error: body.error,
        msgCode: body.msgCode,
        msg_Code_1: body.msg_Code_1,
        mes_Vn: body.mes_Vn,
        mes_En: body.mes_En,
        // status: body.status
      });
    }).catch(err => {

    });
  }
}



