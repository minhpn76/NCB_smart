import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'product-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  productForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      nameProductVN: ['', Validators.required],
      nameProductEN: ['', Validators.required]
    });
  }
  get Form() { return this.productForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.productForm.invalid) {
        return;
    }
    this.toastr.success('Thêm mới thành công', 'Thành công!');
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.provinceForm.value));
  }
  resetForm() {
    this.productForm.reset();
  }
}


