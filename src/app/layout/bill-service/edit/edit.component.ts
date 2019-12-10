import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';

@Component({
  selector: 'bill-services-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  departCode: any;
  listTempProd: any = [];
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
  ) {
    this.getListCompName();
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.departCode = params.itemId;
    });
    this.dataForm = this.formBuilder.group({
      providerCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      providerName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      serviceCode: ['--Chọn giá trị--', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      partner: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: ['']
    });
    this.getItem(this.departCode);
  }
  get Form() { return this.dataForm.controls; }
  getListCompName() {
    this.ncbService.getListProdName().then(res => {
      if (res.json().code === '00') {
        this.listTempProd.push({
          name: '--Chọn giá trị--',
          code: '--Chọn giá trị--',
        });
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
  onChangeComp(e) {
    const newArr = this.listTempProd.find(e => e.code === this.dataForm.value.serviceCode);
    this.dataForm.patchValue({
        providerName : newArr.name
    });
  }
  onChangeCompC(event) {
    const newArr = this.listTempProd.find(e => e.code === this.dataForm.value.serviceCode);
      this.dataForm.patchValue({
        serviceCode : newArr.code
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const payload = {
      id : this.departCode,
      ...this.dataForm.value
    };
    this.ncbService.updateProvider(payload).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.resetForm();
        }, 500);
      } else if (result.json().code === '906') {
        this.toastr.error('Dữ liệu đã tồn tài', 'Thất bại!');
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
  getItem(params) {
    this.ncbService.detailProvider({ id: params }).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        providerCode: body.providerCode,
        partner: body.partner,
        providerName: body.providerName,
        serviceCode: body.serviceCode,
        status: body.status
      });
    }).catch(err => {
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/bill-service');
  }
}



