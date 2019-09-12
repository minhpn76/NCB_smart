import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';

@Component({
  selector: 'telecom-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService]
})
export class EditComponent implements OnInit {
  telecomForm: FormGroup;
  submitted = false;
  telecomId: any;
  obj: any = {
    paramNo: '',
    paramName: '',
    paramValue: '',
    note: '',
    status: ''
  };
  listStatus: any = [
    {
      name: 'Tất cả',
      code: '',
    },
    {
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Inactive',
      code: 'D',
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService
  ) {
    this.route.params.subscribe(params => {
      this.telecomId = params.itemId;
    });
    this.telecomForm = this.formBuilder.group({
      paramNo: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      paramName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      paramValue: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      note: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      status: 'A'
    });
  }

  ngOnInit() {
    this.getItem(this.telecomId);
  }
  get Form() { return this.telecomForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.telecomForm.invalid) {
        return;
    }
    this.ncbService.updateParamCallCenter(this.telecomForm.value).then((result) => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
            this.router.navigateByUrl('/telecom');
        }, 500);
      } else {
          this.toastr.error('Sửa tham số tổng đài thất bại', 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().description, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/telecom');
  }
  getItem(params) {
    this.ncbService.detailParamCallCenter({
      paramNo: params
    }).then((result) => {
      const body = result.json().body;
      this.telecomForm.patchValue({
        paramNo: body.paramNo,
        paramName : body.paramName,
        paramValue : body.paramValue,
        note : body.note,
        status : body.status,
      });
    }).catch(err => {

    });
  }
}






