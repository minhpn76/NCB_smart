import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';

@Component({
  selector: 'branch-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
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
    public ncbService: NCBService,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.departCode = params.itemId;
    });
    this.dataForm = this.formBuilder.group({
      compCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      compName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      address: [''],
      dao: ['', this.helper.noWhitespaceValidator],
      mcn: [''],
      mp: ['']
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
    this.ncbService.updateCompany(this.dataForm.value).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
            this.router.navigateByUrl('/branch');
        }, 500);
      } else if (result.json().code === '920') {
          this.toastr.error('Dữ liệu DAO đã tồn tại', 'Thất bại!');
      } else {
        this.toastr.error('Sửa chi nhánh thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error('Sửa chi nhánh thất bại', 'Thất bại!');
    });
  }
  getItem(params) {
    this.ncbService.detailCompany({compCode: params}).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        compCode: body.compCode,
        compName: body.compName,
        address: body.address,
        mcn: body.mcn,
        dao: body.dao,
        mp: body.mp
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/branch');
  }
}



