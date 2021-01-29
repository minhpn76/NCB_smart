import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  costsId: any;
  listStatus: any = [
    {
      name: 'Có hiệu lực',
      code: 1,
    },
    {
      name: 'Không hiệu lực',
      code: 0,
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    public ncbService: NCBService,
    private helper: Helper
  ) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.costsId = params.itemId;
    });
    this.dataForm = this.formBuilder.group({
      status: 1,
      costName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      costCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
    });
    this.getItem(this.costsId);
  }

  get Form() { return this.dataForm.controls; }
  getItem(params) {
    this.ncbService.getdetailtHpCosts(params).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        costName: body.costName,
        costCode: body.costCode,
        status: body.status
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/hpcosts');
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
     console.log('bung');
      return;
    }
    const payload = {
      id: this.costsId,
      ...this.dataForm.value
    };
    this.ncbService.updateHpCosts(payload).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/hpcosts');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
}
