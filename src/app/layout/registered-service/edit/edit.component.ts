import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'qas-info-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService]
})
export class EditComponent implements OnInit {
  public Editor = ClassicEditor;

  dataForm: FormGroup;
  submitted = false;
  itemId: any;
  obj: any = {
    status: '',
    compCode: '',
    compName: '',
    comment: '',
    userId: ''
  };
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
    if (this.obj.userId === ''
      || this.obj.comment === ''
      || this.obj.status === ''
      || this.obj.compName === ''
      || this.obj.compCode === ''
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
    this.ncbService.updateRegisterService(id, data).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/registered-service');
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
    this.router.navigateByUrl('/registered-service');
  }
  getItem(params) {
    this.ncbService.detailRegisterService(params).then((result) => {
      const body = result.json().body.content;
      this.obj.customer_name = body.customer_name;
      this.obj.idCard = body.idCard;
      this.obj.phone = body.phone;
      this.obj.service = body.service;
      this.obj.compName = body.compName;
      this.obj.status = body.status;
      this.obj.datetime = body.datetime;
      this.obj.userId = body.userId;
      this.obj.new_value = body.new_value;
    }).catch(err => {

    });
  }
}



