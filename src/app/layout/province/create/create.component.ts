import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'province-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [Helper, NCBService]
})
export class CreateComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  private modalOp: NgbModalRef;
  fileExcel: any = {
    file: File,
    path: null,
    name: ''
  };
  temp: any = {
    loading: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private ncbService: NCBService,
    private helper: Helper,
    public router: Router

  ) { }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      cityName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      cityCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      status: ['A']
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    this.ncbService.createProvince(this.dataForm.value).then((result) => {
      if (result.json().code === '00') {
        this.toastr.success('Thêm mới thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/province');
        }, 500);
      } else {
        this.toastr.error('Thêm mới thất bại', 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().description, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/province');
  }
}


