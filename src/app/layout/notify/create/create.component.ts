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
      provider: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      type: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      error: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      msg_Code: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      msg_Code_1: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      mes_Vn: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      mes_En: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
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


