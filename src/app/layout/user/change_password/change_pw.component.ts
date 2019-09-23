import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';
import { Router } from '@angular/router';


@Component({
  selector: 'change-password',
  templateUrl: './change_pw.component.html',
  styleUrls: ['./change_pw.component.scss'],
  providers: [NCBService, Helper]
})

export class ChangePasswordComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  user = {
    newPassword : ''
  };
  re_newPasswordErr: boolean;
  userInfo: any;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    private helper: Helper,
    public router: Router,
  ) {
    this.userInfo = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : '';
    if (this.userInfo.loginCount === 1) {
      this.toastr.warning('Tài khoản của bạn đăng nhập lần đầu. Hãy đổi lại mật khẩu!', 'Thông báo');
    }
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: [this.userInfo.userName],
      oldPassword: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      newPassword: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      re_newPassword: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
    }, {
      validator: this.helper.MustMatch('newPassword', 're_newPassword')
    });
  }
  get Form() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }
    const payload = {
      username: this.userForm.value.username,
      oldPassword: this.userForm.value.oldPassword,
      newPassword: this.userForm.value.newPassword
    };
    this.ncbService.updatePassword(payload).then((result) => {
      if (result.json().code === '00') {
        this.toastr.success('Thay đổi mật khẩu thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 500);
      } else if (result.json().code === '405') {
        this.toastr.error('Mật khẩu cũ không hợp lệ', 'Thất bại!');
      } else {
        this.toastr.error('Thay đổi mật khẩu thất bại', 'Thất bại!');
      }
    }).catch((err) => {


    });
  }
  resetForm() {
    this.router.navigateByUrl('/');
  }

}



