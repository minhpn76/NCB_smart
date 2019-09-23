import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../../../app.settings';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'role-decen',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService]
})
export class ListComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  listPGD: any = [];
  listBranch: any = [];
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  re_search: any = {
    roleName: '',
    status: 'A',
    page: 1,
    size: 1000
  };
  isArrayRole = false;
  listRoles: any;
  tempRole: any;
  obj: any = {};
  role: any = {
    create: null,
    delete: null,
    read: null,
    update: null,
  };
  constructor(
    private ncbService: NCBService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      roleName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      status: ['A'],
      page: ['1'],
      size: ['1000']
    });
  }
  get Form() { return this.dataForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    this.totalSearch = 0;
    this.isProcessLoad = 1;
    this.ncbService.searchRoles(this.dataForm.value).then((result) => {
      setTimeout(() => {
        this.isProcessLoad = 0;
        const body = result.json().body.content;
        if (body.length === 0) {
          this.isProcessLoad = 1;
          this.totalSearch = 0;
          setTimeout(() => {
            this.isProcessLoad = 0;
          }, 1000);
          return;
        }
        this.obj = body[0];
        if (this.obj.description.indexOf('[') > -1) {
          this.listRoles = JSON.parse(this.obj.description) ? JSON.parse(this.obj.description) : '';
        } else {
          this.listRoles = AppSettings.listRoles;
        }
        this.totalSearch = result.json().body.content.length;
        }, 3000);
    }).catch((err) => {
      this.isProcessLoad = 1;
      this.totalSearch = 0;
      setTimeout(() => {
        this.isProcessLoad = 0;
        this.toastr.error(`Có lỗi xảy ra ${err.json()}`, 'Vui lòng thử lại!');
      }, 3000);
    });
  }
  updateRole(obj): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.ncbService.updateRoles(obj).then((result) => {
        if (result.status === 200) {
          if (result.json().code !== '00') {
            this.toastr.error(result.json().message, 'Thất bại!');
            resolve();
          } else {
            this.obj.description = JSON.stringify(this.listRoles);
            this.toastr.success('Cập nhật thành công', 'Thành công!');
            resolve();
          }
        } else {
          this.toastr.error(result.message, 'Thất bại!');
          resolve();
        }
      }).catch((err) => {
        this.toastr.error(err.message, 'Thất bại!');
        resolve();
      });
    });
    return promise;
  }
  clickFullRoles(event) {
    this.listRoles.forEach(role => {
      if (role.code === event.target.id) {
        if (event.currentTarget.checked === true) {
          role.isC = true;
          role.isU = true;
          role.isD = true;
          role.isR = true;
          role.isAll = true;
        } else {
          role.isC = false;
          role.isU = false;
          role.isD = false;
          role.isR = false;
          role.isAll = false;
        }
      }
    });
  }
  clickSetRole(event, value) {
    const passCode = event.target.id;
    this.tempRole = {};
    switch (value) {
      case 1:
          const splited_add = passCode.split('add_')[1];
          this.listRoles.forEach(role => {
            if (role.code === splited_add) {
              if (event.currentTarget.checked === true) {
                role.isC = true;
              } else {
                role.isC = false;
              }
            }
          });
        break;
      case 2:
        const splited_read = passCode.split('read_')[1];
        this.listRoles.forEach(role => {
          if (role.code === splited_read) {
            if (event.currentTarget.checked === true) {
              role.isR = true;
            } else {
              role.isR = false;
            }
          }
        });
        break;
      case 3:
        const splited_update = passCode.split('update_')[1];
        this.listRoles.forEach(role => {
          if (role.code === splited_update) {
            if (event.currentTarget.checked === true) {
              role.isU = true;
            } else {
              role.isU = false;
            }
          }
        });
        break;
      case 4:
        const splited_delete = passCode.split('delete_')[1];
        this.listRoles.forEach(role => {
          if (role.code === splited_delete) {
            if (event.currentTarget.checked === true) {
              role.isD = true;
            } else {
              role.isD = false;
            }
          }
        });
        break;
    }

  }
  async onSubmitRole() {
    const payload = {
      roleName: this.dataForm.controls.roleName.value,
      description: JSON.stringify(this.listRoles),
      status: this.dataForm.controls.status.value
    };
    await this.updateRole(payload);
  }
}
