import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';

@Component({
  selector: 'feature-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [Helper]
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
    private helper: Helper
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.branchId = parseInt(params.branchId);
    });
    this.branchForm = this.formBuilder.group({
      branchCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      branchName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      optionProvince: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      optionDistrict: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      addressName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],

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



