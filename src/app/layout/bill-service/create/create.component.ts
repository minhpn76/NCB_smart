import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'billservice-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  billServiceForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.billServiceForm = this.formBuilder.group({
      serviceTTHDCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      servicepPartnerTTHDCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      PartnerNCBCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      namePartnerTTHDVN: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      optionServiceTTHD: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])]
    });
  }
  get Form() { return this.billServiceForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.billServiceForm.invalid) {
        return;
    }
    this.toastr.success('Thêm mới thành công', 'Thành công!');
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.billServiceForm.value));
  }
  resetForm() {
    this.billServiceForm.reset();
  }
}



