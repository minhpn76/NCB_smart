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
    productCode: '',
    productName: '',
    question: '',
    answer: '',
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
      || this.obj.answer === ''
      || this.obj.question === ''
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
    this.ncbService.updateNcbQA(data).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/qas-info');
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
    this.router.navigateByUrl('/qas-info');
  }
  getItem(params) {
    this.ncbService.detailNcbQA(params).then((result) => {
      const body = result.json().body;
      this.obj.status = body.status;
      this.obj.productCode = body.productCode;
      this.obj.productName = body.productName;
      this.obj.question = body.question;
      this.obj.answer = body.answer;
    }).catch(err => {

    });
  }
}



