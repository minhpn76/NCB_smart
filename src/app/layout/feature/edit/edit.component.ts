import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'feature-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  branchForm: FormGroup;
  submitted = false;
  branchId: any;
  listProvice: any = [
    {
      name: 'Tất cả',
      code: 0,
    },
    {
      name: 'Hà Nội',
      code: 1,
    }
  ];
  listDistrict: any = [
    {
      name: 'Vui lòng chọn quận huyện',
      code: 0,
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.branchId = parseInt(params.branchId);
    });
    this.branchForm = this.formBuilder.group({
      branchCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      branchName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      optionProvince: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      optionDistrict: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      addressName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],

    });
  }
  get Form() { return this.branchForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.branchForm.invalid) {
        return;
    }
    this.toastr.success('Thêm mới thành công', 'Thành công!');
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.branchForm.value));
  }
  resetForm() {
    this.branchForm.reset();
  }
}



