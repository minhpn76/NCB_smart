import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'suggesstions-error-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  itemId: any;
  obj: any = {
    status: '',
    productCode: '',
    productName: '',
    type: '',
    email: '',
    phone: '',
    name: '',
    address: '',
    description: ''
  };
  listStatus: any = [
    {
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Inactive',
      code: 'D',
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService
  ) {
      this.route.params.subscribe(params => {
        this.itemId = parseInt(params.itemId);
    });
   }

  ngOnInit() {
    this.getItem({id: this.itemId});
  }
  onSubmit() {
    this.submitted = true;
    if (this.obj.productCode === ''
      || this.obj.productName === ''
      || this.obj.description === ''
      || this.obj.address === ''
      || this.obj.name === ''
      || this.obj.phone === ''
      || this.obj.email === ''
      || this.obj.type === ''
    ) {
      this.toastr.error('Không được để trống các trường', 'Lỗi!');
      return;
    }
    const id = {
      id: this.itemId
    };
    const data = {
      ...this.obj,
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
      this.obj.status = body.status;
      this.obj.productCode = body.productCode;
      this.obj.productName = body.productName;
      this.obj.type = body.type;
      this.obj.email = body.email;
      this.obj.phone = body.phone;
      this.obj.name = body.name;
      this.obj.address = body.address;
      this.obj.description = body.description;
    }).catch(err => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
}



