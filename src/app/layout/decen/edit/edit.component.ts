import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Helper } from '../../../helper';
import { AppSettings } from '../../../app.settings';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'role-decen',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
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
  itemId: any;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService,
    private helper: Helper
  ) {
    this.route.params.subscribe(params => {
      this.itemId = params.itemId;
    });
    this.getItemRole();
  }

  ngOnInit() {

  }

  getItemRole() {
    this.totalSearch = 0;
    this.isProcessLoad = 1;
    this.ncbService.searchRoles({
      roleName: this.itemId,
      status: 'A',
      page: 1,
      size: 1000
    }).then((result) => {
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
      }, 500);
    });
  }
  updateRole(obj): Promise < any > {
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
  resetForm() {
    this.router.navigateByUrl('/decen');
  }
  async onSubmitRole() {
    const payload = {
      roleName: this.itemId,
      description: JSON.stringify(this.listRoles),
      status: 'A'
    };
    await this.updateRole(payload);
  }
}
