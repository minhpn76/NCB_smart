import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';

@Component({
  selector: 'qr-services-edit',
  templateUrl: './edit-qr.component.html',
  styleUrls: ['./edit-qr.component.scss'],
  providers: [NCBService, Helper]
})
export class EditQrComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  qrService: any;
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
    public ncbService: NCBService,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.qrService = params.itemId;
    });
    this.dataForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      serviceType: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: ['']
    });
    this.getItem(this.qrService);
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
    this.ncbService.updateQRServer(this.qrService , payload).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/qr-services');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
  getItem(params) {
    this.ncbService.dQRServer(params).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        title: body.title,
        serviceType: body.serviceType,
        status: body.status
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/qr-services');
  }
}



