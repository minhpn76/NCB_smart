import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'guide-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService]
})
export class EditComponent implements OnInit {
  public Editor = ClassicEditor;
  dataForm: FormGroup;
  submitted = false;
  itemId: any;
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
    this.dataForm = this.formBuilder.group({
      serviceId: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      content: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      status: ''
    });
  }
  get Form() { return this.dataForm.controls; }

  ngOnInit() {
    this.getItem({id: this.itemId});
  }
  onSubmit() {
    this.submitted = true;
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
    this.ncbService.updateNcbGuide(data).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/guide');
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
    this.router.navigateByUrl('/guide');
  }
  getItem(params) {
    this.ncbService.detailNcbGuide(params).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        status: body.status,
        serviceId: body.serviceId,
        content: body.content
      });
    }).catch(err => {

    });
  }
}



