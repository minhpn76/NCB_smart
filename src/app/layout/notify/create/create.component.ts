import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Helper } from '../../../helper';

@Component({
  selector: 'notify-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  public Editor = ClassicEditor;
  dataForm: FormGroup;
  submitted = false;
  userInfo: any;
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
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper
  ) {
    this.userInfo = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : '';
   }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      provider: ['', Validators.compose([Validators.required, ])],
      type: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      error: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      msgCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      msg_Code_1: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      mes_Vn: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      mes_En: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      user_Id: [this.userInfo.userId],
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    // const formData = this.helper.urlEncodeParams(this.dataForm.value);
    this.ncbService.createNotify(this.dataForm.value).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Thêm thành công', 'Thành công!');
          setTimeout(() => {
            this.resetForm();
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
    this.router.navigateByUrl('/notify');
  }
}


