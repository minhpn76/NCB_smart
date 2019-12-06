import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';

@Component({
  selector: 'telecom-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService,  Helper ]
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
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Deactive',
      code: 'D',
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService,
    private helper:  Helper
  ) {
    this.route.params.subscribe(params => {
      this.telecomId = params.itemId;
    });
    this.telecomForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      value: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      description: [''],

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
    const payload = {
      id: this.telecomId,
      name: this.telecomForm.value.name,
      value: this.telecomForm.value.value,
      description: this.telecomForm.value.description,
    };
    this.ncbService.updateParamCallCenter(payload).then((result) => {
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
      id: params
    }).then((result) => {
      const body = result.json().body;
      this.telecomForm.patchValue({
        name: body.name,
        value : body.value,
        description : body.description
      });
    }).catch(err => {

    });
  }
}






