import { Component, OnInit, Input } from '@angular/core';
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
      this.router.navigateByUrl('/schools');
    }
  }
  pageRefresh() {
    location.reload();
    localStorage.setItem('redirect', 'true');
 }
  get Form() { return this.dataForm.controls; }
  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      schoolName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      schoolCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
    //  schoolCif: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      ACCTNo: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      ACCTName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      citadGT: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      citadTT: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: '1',
      address: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      phoneNumber: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])]
    });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const payload = [{
      schoolCode: this.dataForm.value.schoolCode,
      schoolName:  this.dataForm.value.schoolName,
      schoolCif: null,
      schoolAcctNo: this.dataForm.value.ACCTNo,
      schoolAcctName:  this.dataForm.value.ACCTName,
      schoolBankCode: '',
      schoolBankName: '',
      schoolCitadGt: this.dataForm.value.citadGT,
      schoolCitadTT: this.dataForm.value.citadTT,
      schoolAddress: this.dataForm.value.address,
      schoolPhoneNumber: this.dataForm.value.phoneNumber,
      status: this.dataForm.value.status,
      createAt: '',
      updateAt: null,
      deleteAt: null
    }];
    console.log(payload);
    // Add code sumit from khi có api
    this.ncbService.createHpSchoolDetail(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Thêm thành công', 'Thành công!');
          // this.pageRefresh();
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
    this.router.navigateByUrl('/schools');
  }
}
