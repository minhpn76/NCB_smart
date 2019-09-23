import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';

@Component({
  selector: 'edit-user',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [NCBService, Helper]
})

export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  listPGD: any = [];
  listBranch: any = [];
  listRole: any = [];
  itemId: any = '';
  obj: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    private helper: Helper,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.itemId = params.itemId;
    });
    this.getItem(this.itemId);
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      branchCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      transactionCode: [this.listPGD, Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      status: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      username: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      // tslint:disable-next-line:max-line-length
      fullName: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(/^((?!\s{1,}).)*$/)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      phone: ['', Validators.compose([Validators.maxLength(13), Validators.pattern(/^((?!\s{1,}).)*$/)])]
    });
    this.getBranchs();
    this.getListRole();
    this.getAllPGD();
  }
  get Form() { return this.dataForm.controls; }

  getBranchs() {
    this.listBranch = [];
    this.ncbService.getBranchs().then((result) => {
      this.listBranch.push({ code: 0, name: 'Tất cả' });

      result.json().body.forEach(element => {
        this.listBranch.push({
          code: element.brnCode,
          name: element.branchName,
        });
      });

    }).catch((err) => {
      this.toastr.error('Không lấy được dự liệu chi nhánh!', 'Thất bại!');
    });
  }
  async onChangePGD(value) {
    if (value === '') {
      await this.getAllPGD();
    } else {
      await this.getPGD(value);
    }
  }
  getPGD(value) {
    this.listPGD = [];
    this.ncbService.getPGD({brnCode: value}).then((result) => {
      this.listPGD.push({ code: '', name: 'Tất cả' });
      result.json().body.content.forEach(element => {
        this.listPGD.push({
          code: element.departCode,
          name: element.departName,
        });
      });

    }).catch((err) => {
      this.toastr.error('Không lấy được dữ liệu phòng giao dịch', 'Thất bại');
    });
  }
  getAllPGD() {
    this.listPGD = [];
    this.ncbService.getListPGD().then((result) => {
      this.listPGD.push({ code: '', name: 'Tất cả' });
      result.json().body.forEach(element => {
        this.listPGD.push({
          code: element.departCode,
          name: element.departName,
        });
      });
    }).catch((err) => {
      this.toastr.error('Không lấy được dữ liệu phòng giao dịch', 'Thất bại');
    });
  }
  getListRole() {
    this.listRole = [];
    this.ncbService.searchRoles({
      status: 'A',
      roleName: '',
      page: 1,
      size: 1000
    }).then((result) => {
      this.listRole.push({ code: '', name: 'Tất cả' });
      result.json().body.content.forEach(element => {
        this.listRole.push({
          code: element.roleId,
          name: element.roleName,
        });
      });
    }).catch((err) => {
      this.toastr.error('Không lấy được dự liệu phân quyền!', 'Thất bại!');
    });
  }
  getItem(params) {
    this.ncbService.detailUser(params).then((result) => {
      const body = result.json().body.content;
      this.dataForm.patchValue({
        branchCode: body.branchCode,
        transactionCode: body.transactionCode,
        fullName: body.fullName,
        status: body.status === 'A' ? true : false,
        phone: body.phone,
        email: body.email,
        username: body.userName
      });
    }).catch(err => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
  changeStatus(event, data) {
    const payload = {
      username: this.dataForm.controls.username.value,
      status: event.currentTarget.checked === true ? 'A' : 'D'
    };
    this.ncbService.updateStatusUser(payload).then((result) => {
      if (result.json().code !== '00') {
        this.toastr.error('Có lỗi xảy ra!', 'Thất bại!');
        return;
      }
      this.toastr.success('Sửa thành công', 'Thành công!');
    }).catch((err) => {
      this.toastr.error(err, 'Thất bại!');

    });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
        return;
    }
    delete this.dataForm.value['status'];
    this.ncbService.updateUser(this.dataForm.value).then((result) => {
      if (result.json().code !== '00') {
        this.toastr.error('Có lỗi xảy ra!', 'Thất bại!');
        return;
      }
      this.toastr.success('Sửa thành công', 'Thành công!');
      setTimeout(() => {
        this.router.navigateByUrl('/user');
      }, 500);

    }).catch((err) => {


    });
  }
  resetForm() {
    this.router.navigateByUrl('/user');
  }
}
