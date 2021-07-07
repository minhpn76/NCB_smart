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
      code: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      description: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      chg_id: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      chg_amt: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      ccy: ['VND', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
     status: '1',
    });
    this.getItem(this.costsId);
  }

  get Form() { return this.dataForm.controls; }
  getItem(params) {
    this.ncbService.getdetailtNiceAcfee(params).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        code: body.code,
        description: body.description,
        chg_id: body.chg_id,
        chg_amt: body.chg_amt,
        ccy: body.ccy,
        status: body.status
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/nice-ac-fee');
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
    this.ncbService.updateNiceAcfee(payload).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/nice-ac-fee');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
}
