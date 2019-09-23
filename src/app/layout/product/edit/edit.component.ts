import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'product-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  productForm: FormGroup;
  submitted = false;
  Id: any

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.Id = parseInt(params.Id);
    });
  }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      nameProductVN: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      nameProductEN: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])]
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
















