import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'provision-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService]
})
export class CreateComponent implements OnInit {
  public Editor = ClassicEditor;
  dataForm: FormGroup;
  submitted = false;
  listSelect: any = [
    {
      code: 0,
      name: 'Miễn phí'
    },
    {
      code: 1,
      name: '10%'
    },
    {
      code: 2,
      name: '20%'
    },
    {
      code: 3,
      name: '25%'
    },
    {
      code: 4,
      name: '50%'
    },
    {
      code: 5,
      name: '75%'
    },
    {
      code: 6,
      name: '100%'
    }
  ];
  listPromotion: any = [
    {
      code: 0,
      name: 'ALL'
    },
    {
      code: 1,
      name: 'NCB'
    },
    {
      code: 2,
      name: 'IZI'
    },
    {
      code: 3,
      name: 'VIP2'
    },
    {
      code: 4,
      name: 'GAMI'
    },
    {
      code: 5,
      name: 'VIP3'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router
  ) { }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      description: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      phithuongnien: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      philienNH: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      phinoibo: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      phi247: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      goisp: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      status: 'A'
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    this.toastr.error('API chưa hoàn thiện!', 'Thất bại!');
    // this.ncbService.createNcbGuide(this.dataForm.value).then((result) => {
    //   if (result.status === 200) {
    //     if (result.json().code !== '00') {
    //       this.toastr.error(result.json().message, 'Thất bại!');
    //     } else {
    //       this.toastr.success('Thêm thành công', 'Thành công!');
    //       setTimeout(() => {
    //         this.router.navigateByUrl('/guide');
    //       }, 500);
    //     }
    //   } else {
    //     this.toastr.error(result.message, 'Thất bại!');
    //   }
    // }).catch((err) => {
    //   this.toastr.error(err.json().message, 'Thất bại!');
    // });
  }
  resetForm() {
    this.router.navigateByUrl('/guide');
  }
}


