import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';

@Component({
  selector: 'qr-coupons-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  qrCoupons: any;
  listStatus: any = [
    {
      name: 'Kích hoạt',
      code: 'A',
    },
    {
      name: 'Chưa kích hoạt',
      code: 'D',
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
      this.qrCoupons = params.itemId;
    });
    this.dataForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      description: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: ['']
    });
    this.getItem(this.qrCoupons);
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const payload = {
      ...this.dataForm.value
    };
    this.ncbService.updateQRCoupon(this.qrCoupons , payload).then(result => {
      if (result.json().status === 'D') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/qr-coupons');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
  getItem(params) {
    this.ncbService.detailQRCoupon(params).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        name: body.name,
        description: body.description,
        status: body.status
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/qr-coupons');
  }
}
