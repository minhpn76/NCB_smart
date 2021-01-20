import { Console } from 'console';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  classId: any;
  facultyCode: any;
  listStatus: any = [
    {
      name: 'Active',
      code: 1,
    },
    {
      name: 'Deactive',
      code: 0,
    }
  ];
  listSchool: any = [];
  listFaculties: any = [];
  obj_searchFaculties = {
    codeSchool: '',
    codeFacultie: '',
    status: 1,
    size: 10000,
    page: 1,
    previous_page: 0
  };
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    public ncbService: NCBService,
    private helper: Helper
  ) { }
  get Form() { return this.dataForm.controls; }
  resetForm() {
    this.router.navigateByUrl('/clazz');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.classId = params.itemId;
    });
    this.getSchools();
    this.dataForm = this.formBuilder.group({
      schoolCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      facultyCode: '',
      className: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      classCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: '',
    });
   this.getItem(this.classId);
  }

  getItem(params) {
    this.ncbService.getdetailtHpClass(params).then((result) => {
      const body = result.json().body;
      this.facultyCode = body.facultyCode;
      this.getFaculties(body.schoolCode);
      this.dataForm.patchValue({
        schoolCode: body.schoolCode,
        facultyCode: body.facultyCode,
        className: body.className,
        classCode: body.classCode,
        status: body.status,
      });

    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
     console.log('bung');
      return;
    }
    const payload = {
      id: this.classId,
      ...this.dataForm.value
    };
    this.ncbService.updateHpClass(payload).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/clazz');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
 /*Get thông tin nhập liệu */
getSchools() {
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
    this.listSchool = [];
    this.toastr.error('Không lấy được dữ liệu trường học', 'Thất bại');
  });
}
getFaculties(idschool) {

  this.listFaculties = [];
  this.obj_searchFaculties.codeSchool = idschool;
  // xu ly
  this.ncbService.getListHpFaculties(this.obj_searchFaculties).then((result) => {
    setTimeout(() => {
      const body = result.json().body.content;
      body.forEach(element => {
        this.listFaculties.push({
          facultyName: ' - ' + element.facultyName,
          facultyCode: element.facultyCode
        });
      });
    }, 300);
    this.dataForm.value.facultyCode = this.facultyCode;
    console.log('Xử lý lại việc load khoa');
  }).catch(err => {
    this.listFaculties = [];
    this.toastr.error('Không lấy được dữ liệu khoa', 'Thất bại');
  });

}
}
