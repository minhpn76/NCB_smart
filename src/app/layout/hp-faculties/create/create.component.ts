import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { Helper } from '../../../helper';
import { AppSettings } from '../../../app.settings';
import { Location } from '@angular/common';
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
  listSchool: any;
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
     this.router.navigateByUrl('/faculties');
   }
  }
  pageRefresh() {
    location.reload();
    localStorage.setItem('redirect', 'true');
 }
  getSchool() {
    this.listSchool = [];
    // xu ly
    this.ncbService.getListHpSchool(null).then((result) => {
      setTimeout(() => {
        const body = result.json().body.content;
        body.forEach(element => {
          this.listSchool.push({
            schoolName: ' - ' + element.schoolName,
            schoolCode: element.schoolCode
          });
        });
      }, 300);
    }).catch(err => {
      this.toastr.error('Không lấy được dữ liệu trường học', 'Thất bại');
    });
  }
 get Form() { return this.dataForm.controls; }
  resetForm() {
    this.router.navigateByUrl('/faculties');
  }
  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      facultyName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      facultyCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      schoolCode: '',
   });
   this.getSchool();
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const payload = {
      schoolCode: this.dataForm.value.schoolCode,
      facultyName: this.dataForm.value.facultyName,
      facultyCode: this.dataForm.value.facultyCode,
      status: 1
    };

    // Add code sumit from khi có api
    this.ncbService.createHpFaculty(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, result.json().description );
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
}
