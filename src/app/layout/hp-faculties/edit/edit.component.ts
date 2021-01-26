import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  listSchool: any;
  facultyId: any;
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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    public ncbService: NCBService,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.facultyId = params.itemId;
    });
    this.getSchools();
    this.dataForm = this.formBuilder.group({
      schoolCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      facultyName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      facultyCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: 1
    });
    this.getItem(this.facultyId);
  }
  get Form() { return this.dataForm.controls; }
  getItem(params) {
    this.ncbService.getdetailtHpFacultie(params).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        schoolCode: body.schoolCode,
        facultyName: body.facultyName,
        facultyCode: body.facultyCode,
        status: body.status,
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  getSchools() {
    this.ncbService.getListHpSchool(null).then((result) => {
      const body = result.json().body.content;
      this.listSchool = body;
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/faculties');
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
     console.log('bung');
      return;
    }
    const payload = {
      id: this.facultyId,
      ...this.dataForm.value
    };
    this.ncbService.updateHpFacultie(payload).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/faculties');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
}
