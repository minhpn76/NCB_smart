import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  schoolId: any;
  listStatus: any = [
    {
      name: 'Có hiệu lực',
      code: 1,
    },
    {
      name: 'Không hiệu lực',
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
      this.schoolId = params.itemId;

    });
    this.dataForm = this.formBuilder.group({
      schoolName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      schoolCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      schoolCif: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      schoolAcctNo: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      schoolAcctName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      schoolBankCode: [''],
      schoolBankName: [''],
      schoolCitadGt: [''],
      schoolCitadTT: [''],
      status: '1',
      schoolAddress: [''],
      schoolPhoneNumber: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])]
    });

    this.getItem(this.schoolId);
  }
  get Form() { return this.dataForm.controls; }
  getItem(params) {
    this.ncbService.getdetailtHpSchool(params).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        schoolName: body.schoolName,
        schoolCode: body.schoolCode,
        schoolCif: body.schoolCif,
        schoolAcctNo: body.schoolAcctNo,
        schoolAcctName: body.schoolAcctName,
        schoolBankCode: body.schoolBankCode,
        schoolBankName: body.schoolBankName,
        schoolCitadGt: body.schoolCitadGt,
        schoolCitadTT: body.schoolCitadTT,
        status: body.status,
        schoolAddress: body.schoolAddress,
        schoolPhoneNumber: body.schoolPhoneNumber,
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/schools');
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
     console.log('bung');
      return;
    }
    const payload = {
      id: this.schoolId,
      ...this.dataForm.value
    };
    this.ncbService.updateHpSchool(payload).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/schools');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
}
