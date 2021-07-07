import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { Helper } from '../../../helper';
import { AppSettings } from '../../../app.settings';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  listRoles: any;
  // @Input() listRoles: any = AppSettings.listRoles;
  tempRole: any;
  obj: any = {};
  role: any = {
    create: null,
    delete: null,
    read: null,
    update: null,
  };
  listStatus: any = [
    {
        name: 'Tất cả',
        code: '',
    },
    {
        name: 'Có hiệu lực',
        code: '1',
    },
    {
        name: 'Không hiệu lực',
        code: '0',
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper,
    public location: Location

  ) {
     this.listRoles = AppSettings.listRoles;
     // Đoạn này dung để khi them moi thanh cong thì hcuyen ve trang danh sach
    if (localStorage.getItem('redirect') === 'true') {
      this.router.navigateByUrl('/nice-ac-fee');
    }
  }

  pageRefresh() {
    location.reload();
    localStorage.setItem('redirect', 'true');
 }
 get Form() { return this.dataForm.controls; }
 ngOnInit() {
  this.dataForm = this.formBuilder.group({
     code: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
     description: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
     chg_id: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
     chg_amt: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
     ccy: ['VND', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
    status: '1',
  });
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const payload = {
      code : this.dataForm.value.code,
      description: this.dataForm.value.description,
      chg_id: this.dataForm.value.chg_id,
      chg_amt: this.dataForm.value.chg_amt,
      ccy: this.dataForm.value.ccy,
      status: this.dataForm.value.status,
    };
    this.ncbService.createNiceAcfee(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, result.json().description);
        } else {
          this.toastr.success('Thêm thành công', 'Thành công!');
          this.pageRefresh();
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
    this.router.navigateByUrl('/nice-ac-fee');
  }

}
