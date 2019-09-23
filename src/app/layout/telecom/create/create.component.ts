import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'telecom-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService]
})
export class CreateComponent implements OnInit {
  telecomForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.telecomForm = this.formBuilder.group({
      paramNo: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      paramName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      paramValue: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      note: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      status: 'A'
    });
  }
  get Form() { return this.telecomForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.telecomForm.invalid) {
        return;
    }
    this.ncbService.createParamCallCenter(this.telecomForm.value).then((result) => {
      if (result.status === 200) {
        if (result.json().code === '00') {
          this.toastr.success('Thêm mới thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/telecom');
          }, 500);
        } else if (result.json().code === '903') {
          this.toastr.error('Tham số tổng đài đã tồn tại', 'Thất bại!');
        } else {
          this.toastr.error(result.json().description, 'Thất bại!');
        }
      } else {
        this.toastr.error(result.json().description, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().description, 'Thất bại!');
    });
  }
  resetForm() {
    this.telecomForm.reset();
    this.router.navigateByUrl('/telecom');
  }
}


