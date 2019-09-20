import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';

@Component({
  selector: 'pos-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  departCode: any;
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
    public ncbService: NCBService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.departCode = params.itemId;
    });
    this.dataForm = this.formBuilder.group({
      brnCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      branchName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      departCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      departName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      address: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      phone: ['', Validators.compose([Validators.maxLength(13), Validators.pattern(/^((?!\s{2,}).)*$/)])],
      fax: ['', Validators.compose([Validators.pattern(/^((?!\s{2,}).)*$/)])],
      latitude: ['', Validators.compose([Validators.pattern(/^((?!\s{2,}).)*$/)])],
      longitude: ['', Validators.compose([Validators.pattern(/^((?!\s{2,}).)*$/)])],
      urlImg: ['', Validators.compose([Validators.pattern(/^((?!\s{2,}).)*$/)])],
      dao: ['', Validators.compose([Validators.pattern(/^((?!\s{2,}).)*$/)])],
      status: ''
    });
    this.getItem(this.departCode);
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
        return;
    }
    this.ncbService.updateBranch(this.dataForm.value).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
            this.router.navigateByUrl('/transaction-room');
        }, 500);
      } else {
          this.toastr.error('Sửa chi nhánh thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
  getItem(params) {
    this.ncbService.detailBranch({departCode: params}).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        brnCode: body.brnCode,
        branchName: body.branchName,
        departCode: body.departCode,
        departName: body.departName,
        address: body.address,
        phone: body.phone,
        longitude: body.longitude,
        latitude: body.latitude,
        dao: body.dao,
        urlImg: body.urlImg,
        status: body.status,
        fax: body.fax
      });
    }).catch(err => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/transaction-room');
  }
}



