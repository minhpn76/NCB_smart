import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { Helper } from '../../../helper';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'suggess-error-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  listType: any = [
    {
      name : 'Báo lỗi',
      code : '01',
    },
    {
      name: 'Góp ý',
      code : '02'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      productCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      productName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      type: ['01', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      phone: [''],
      name: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      address: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      description: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])]
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    this.ncbService.createNcbFeedBack(this.dataForm.value).then((result) => {
      if (result.status === 200) {
        if (result.json().code === '00') {
          this.toastr.success('Thêm mới thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/suggesstions-error');
          }, 500);
        } else if (result.json().code === '908') {
          this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
        } else {
          this.toastr.error('Thêm mới thất bại', 'Thất bại!');
        }
      }
    }).catch((err) => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/suggesstions-error');
  }
}


