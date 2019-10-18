import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';

@Component({
  selector: 'billservice-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  listTempProd: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper,
  ) {
    this.getListCompName();
   }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      providerCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      // tslint:disable-next-line:max-line-length
      providerName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      serviceCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      partner: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])]
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
        return;
    }
    this.ncbService
        .createProvider(this.dataForm.value)
        .then(result => {
            if (result.json().code === '00') {
                this.toastr.success('Thêm mới thành công', 'Thành công!');
                setTimeout(() => {
                    this.router.navigateByUrl('/bill-service');
                }, 500);
            } else if (result.json().code === '906') {
              this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
            } else {
                this.toastr.error('Thêm mới thất bại', 'Thất bại!');
            }
        })
        .catch(err => {});
  }
  resetForm() {
      this.router.navigateByUrl('/bill-service');
  }
  getListCompName() {
    this.ncbService.getListProdName().then(res => {
        if (res.json().code === '00') {
            const body = res.json().body;
            body.forEach(element => {
                this.listTempProd.push({
                    name: element.serviceName,
                    code: element.serviceCode,
                });
            });
        } else {
            this.toastr.error('Không lấy được dự liệu', 'Thất bại');
        }

    }).catch(e => {

    });
  }
  onChangeComp(event) {
    const newArr = this.listTempProd.find(e => e.code === this.dataForm.value.serviceCode);
    this.dataForm.patchValue({
        providerName : newArr.name
    });
  }
  onChangeCompC(event) {
      const newArr = this.listTempProd.find(e => e.name === this.dataForm.value.providerName);
      this.dataForm.patchValue({
        serviceCode : newArr.code
    });
  }
}



