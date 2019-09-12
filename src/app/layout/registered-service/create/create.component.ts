import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'curency-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  currencyForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.currencyForm = this.formBuilder.group({
      code_currency: ['', Validators.required],
      name_currency: ['', Validators.required]

    });
  }
  get Form() { return this.currencyForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.currencyForm.invalid) {
        return;
    }
    this.toastr.success('Thêm mới thành công', 'Thành công!');
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.currencyForm.value));
  }
  resetForm() {
    this.currencyForm.reset();
  }
}


