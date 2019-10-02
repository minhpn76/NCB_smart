import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'suggesstions-error-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService,  Helper ]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  itemId: any;
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
  listType: any = [
    {
      name : 'Báo lỗi',
      code : '01',
    },
    {
      name: 'Góp ý',
      code : '02'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService,
    private helper:  Helper
  ) {
      this.route.params.subscribe(params => {
        this.itemId = parseInt(params.itemId);
      });
      this.dataForm = this.formBuilder.group({
        productCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
        productName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
        type: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
        email: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
        phone: [''],
        name: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
        address: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
        description: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
        status: ['']
      });
  }
  get Form() { return this.dataForm.controls; }


  ngOnInit() {
    this.getItem({id: this.itemId});
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const id = {
      id: this.itemId
    };
    const data = {
      ...this.dataForm.value,
      ...id
    };
    this.ncbService.updateNcbFeedBack(data).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/suggesstions-error');
          }, 500);
        }
      } else {
        this.toastr.error(result.message, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.message, 'Thất bại!');

    });
  }
  resetForm() {
    this.router.navigateByUrl('/suggesstions-error');
  }
  getItem(params) {
    this.ncbService.detailNcbFeedBack(params).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        status : body.status,
        productCode : body.productCode,
        productName : body.productName,
        type : body.type,
        email : body.email,
        phone : body.phone,
        name : body.name,
        address : body.address,
        description: body.description
      });
    }).catch(err => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
}



